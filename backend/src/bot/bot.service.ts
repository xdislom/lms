import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";

@Injectable()
export class BotService {
    constructor(private prisma: PrismaService) { }

    async findUser(phone: string) {
        const phoned = phone.startsWith("+") ? phone : `+${phone}`

        return this.prisma.user.findUnique({
            where: {
                phone: phoned
            }
        });
    }

    async createTelegramOtp(userId: number, otp: string) {
        const expiresIn = new Date(Date.now() + 5 * 60 * 1000);

        return this.prisma.telegramOtp.create({
            data: {
                userId,
                otp,
                expiresIn
            }
        });
    }
}