import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Extract error details
        const errorResponse = typeof exceptionResponse === 'string'
            ? { message: exceptionResponse }
            : exceptionResponse as any;

        const errorDetails = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: errorResponse.message || exception.message,
            error: errorResponse.error || exception.name,
            ...(errorResponse.details && { details: errorResponse.details }),
            ...(errorResponse.retryAfter && { retryAfter: errorResponse.retryAfter }),
        };

        // Log the error
        this.logger.error(
            `HTTP ${status} Error: ${errorDetails.message}`,
            {
                ...errorDetails,
                stack: exception.stack,
                user: (request as any).user?.id || 'anonymous',
                userAgent: request.get('User-Agent'),
                ip: request.ip,
            }
        );

        response.status(status).json(errorDetails);
    }
}