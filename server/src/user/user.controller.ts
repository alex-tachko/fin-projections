import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor() {}

    @Get()
    @HttpCode(200)
    async signIn(): Promise<string> {
        return 'Hello world';
    }
}
