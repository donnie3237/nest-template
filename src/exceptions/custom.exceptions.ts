import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
    constructor(userId?: string) {
        const message = userId
            ? `User with ID ${userId} not found`
            : 'User not found';

        super({
            message,
            error: 'USER_NOT_FOUND',
            statusCode: HttpStatus.NOT_FOUND,
        }, HttpStatus.NOT_FOUND);
    }
}

export class UserAlreadyExistsException extends HttpException {
    constructor(email?: string) {
        const message = email
            ? `User with email ${email} already exists`
            : 'User already exists';

        super({
            message,
            error: 'USER_ALREADY_EXISTS',
            statusCode: HttpStatus.CONFLICT,
        }, HttpStatus.CONFLICT);
    }
}

export class InvalidCredentialsException extends HttpException {
    constructor() {
        super({
            message: 'Invalid email or password',
            error: 'INVALID_CREDENTIALS',
            statusCode: HttpStatus.UNAUTHORIZED,
        }, HttpStatus.UNAUTHORIZED);
    }
}

export class ValidationException extends HttpException {
    constructor(errors: string[] | string) {
        const message = Array.isArray(errors)
            ? errors.join(', ')
            : errors;

        super({
            message: 'Validation failed',
            error: 'VALIDATION_ERROR',
            details: Array.isArray(errors) ? errors : [errors],
            statusCode: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST);
    }
}

export class BusinessLogicException extends HttpException {
    constructor(message: string, errorCode?: string) {
        super({
            message,
            error: errorCode || 'BUSINESS_LOGIC_ERROR',
            statusCode: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST);
    }
}

export class ResourceLockedException extends HttpException {
    constructor(resource: string) {
        super({
            message: `Resource ${resource} is currently locked`,
            error: 'RESOURCE_LOCKED',
            statusCode: HttpStatus.LOCKED,
        }, HttpStatus.LOCKED);
    }
}

export class RateLimitExceededException extends HttpException {
    constructor(retryAfter?: number) {
        super({
            message: 'Rate limit exceeded',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: retryAfter || 60,
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
        }, HttpStatus.TOO_MANY_REQUESTS);
    }
}

export class ServiceUnavailableException extends HttpException {
    constructor(service?: string) {
        const message = service
            ? `Service ${service} is currently unavailable`
            : 'Service temporarily unavailable';

        super({
            message,
            error: 'SERVICE_UNAVAILABLE',
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}