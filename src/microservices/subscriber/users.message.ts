import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class UserMessage {
    constructor(
        private readonly message: string = "This is a user message"
    ) { }

    @MessagePattern({
        svc: 'users',
        cmd: 'GET_USER_BY_UID'
    })
    getUserMessage(@Payload() uid: string): string {
        return uid;
    }
}