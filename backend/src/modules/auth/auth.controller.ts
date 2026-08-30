import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto, VerifyOTP, } from './dto/auth.dto';
import { ResetDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() payload: AuthDto) {
        return this.authService.register(payload)
    }

    @Post('verify-telegram-otp')
    async verifyOTP(@Body() payload: VerifyOTP) {
        return this.authService.verify_telegram_otp(payload)
    }

    @Post("reset-password")
    async resetPassword(@Body() payload: ResetDto) {
        return this.authService.resetPassword(payload)
    }


    @Post('login')
    login(@Body() payload: LoginDto) {
        return this.authService.login(payload)
    }
}
