import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from "argon2"
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { Roles } from '@prisma/client';
import hashPassword from 'src/common/config/hash';
import { EmailService } from 'src/common/email/email.service';

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
            throw new NotFoundException('Cource not found');
        }

        const user = await this.prisma.user.findFirst({
            where: {
                phone: payload.phone
            }
        })

        if (user) {
            throw new ConflictException('User already exist')
        }

        const hash = await argon2.hash(payload.password)

        await this.prisma.user.create({
            data: {
                name: payload.name,
                phone: payload.phone,
                password: hash,
                email: payload.email,
                role: Roles.STUDENT,
                cources: {
                    connect: {
                        id: Number(payload.courceId)
                    }
                }
            }
        })

        return {
            success: true,
            message: 'User created successfully!'
        }
    }

    async login(payload: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                phone: payload.phone,
            },
        });

        if (!user) {
            throw new BadRequestException('Phone or password incorrect');
        }

        const passVerify = await argon2.verify(
            user.password,
            payload.password,
        );

        if (!passVerify) {
            throw new UnauthorizedException('Phone or password incorrect');
        }

        const accessToken = await this.jwtService.signAsync({
            id: user.id,
            phone: user.phone,
            role: user.role,
        });

        return {
            success: true,
            accessToken: accessToken
        };
    }
}
