import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() payload: AuthDto) {
        return this.authService.register(payload)
    }

    @Post('login')
    login(@Body() payload: LoginDto) {
        return this.authService.login(payload)
    }
}
