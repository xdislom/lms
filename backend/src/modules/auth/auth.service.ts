import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from "argon2"
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
import { AuthDto, LoginDto, VerifyOTP } from './dto/auth.dto';
import { PaymentStatus, Roles, Status } from '@prisma/client';
import hashPassword from 'src/common/config/hash';
import { EmailService } from 'src/common/email/email.service';
import { ResetDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService, private emailService: EmailService) { }

    async register(payload: AuthDto) {
        const cource = await this.prisma.cources.findUnique({
            where: {
                id: Number(payload.courceId)
            },
        });
        if (!cource) {
            throw new NotFoundException('Cource not found with this id');
        }

        const user = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        })

        if (user) {
            throw new ConflictException('User already exist with this phone number')
        }

        const hash = await argon2.hash(payload.password)

        const newUser = await this.prisma.user.create({
            data: {
                name: payload.name,
                phone: payload.phone,
                password: hash,
                role: Roles.STUDENT,
                status: Status.PENDING
            }
        })

        await this.prisma.purchasedCource.create({
            data: {
                userId: newUser.id,
                courceId: cource.id,
                status: PaymentStatus.PENDING
            }
        })

        return {
            success: true,
            message: 'User created successfully!'
        }
    }

    async verify_telegram_otp(payload: VerifyOTP) {
        const existUser = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        })

        if (!existUser) {
            throw new NotFoundException('User not found with this phone number')
        }

        const telegram_otp = await this.prisma.telegramOtp.findFirst({
            where: {
                userId: existUser.id,
                verified: false
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        if (!telegram_otp) {
            throw new NotFoundException('Otp not found')
        }

        if (telegram_otp.otp !== payload.otp) {
            throw new BadRequestException(
                "Invalid OTP"
            );
        }

        if (telegram_otp.expiresIn < new Date()) {
            throw new BadRequestException(
                "OTP expired"
            );
        }

        await this.prisma.telegramOtp.update({
            where: {
                id: telegram_otp.id
            },
            data: {
                verified: true
            }
        });

        return {
            success: true,
            message: 'Telegram verified successfully!'
        }
    }

    async resetPassword(payload: ResetDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone
            }
        })

        if (!user) {
            throw new NotFoundException(
                'User not found with this phone number'
            )
        }

        const telegramOtp = await this.prisma.telegramOtp.findFirst({
            where: {
                userId: user.id,
                verified: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!telegramOtp) {
            throw new BadRequestException(
                'Please verify Telegram OTP first'
            )
        }

        if (telegramOtp.expiresIn < new Date()) {
            throw new BadRequestException(
                'OTP expired'
            )
        }

        const hashedPassword = await argon2.hash(payload.password)

        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword
            }
        })

        await this.prisma.telegramOtp.delete({
            where: {
                id: telegramOtp.id
            }
        })

        return {
            success: true,
            message: 'Password successfully changed'
        };
    }

    async login(payload: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone,
            },
        })

        if (!user) {
            throw new BadRequestException('Phone or password incorrect')
        }

        const passVerify = await argon2.verify(
            user.password,
            payload.password
        );

        if (!passVerify) {
            throw new UnauthorizedException('Phone or password incorrect')
        }

        const accessToken = await this.jwtService.signAsync({
            id: user.id,
            phone: user.phone,
            role: user.role
        })

        return {
            success: true,
            role: user.role,
            accessToken: accessToken
        }
    }
}
