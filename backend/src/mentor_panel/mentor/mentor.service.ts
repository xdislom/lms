import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus, Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class MentorService {
    constructor(private prisma: PrismaService) { }

    async getMyCources(userId: number) {
        const myCources = await this.prisma.cources.findUnique({
            where: {
                id: userId
            },
            select: {
                _count: {
                    select: {
                        purchasedCources: {
                            where: {
                                status: PaymentStatus.COMPLETED
                            }
                        }
                    }
                },
                mentor: {
                    select: {
                        cources: true
                    }
                }
            }
        })

        return {
            success: true,
            data: myCources
        }
    }
}
