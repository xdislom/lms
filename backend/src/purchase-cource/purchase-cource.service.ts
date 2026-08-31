import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { PurchaseDto } from './dto/purchaseCource.dto';
import { PaymentStatus, Roles } from '@prisma/client';

@Injectable()
export class PurchaseCourceService {
    constructor(private prisma: PrismaService) { }

    async getPurchases() {
        const allPurchases = await this.prisma.purchasedCource.findMany({
            select: {
                userId: true,
                courceId: true,
                status: true,
                purchasedAt: true,

                user: {
                    select: {
                        name: true
                    },
                },

                cource: {
                    select: {
                        name: true,
                        price: true,

                        category: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        })

        return {
            success: true,
            data: allPurchases
        }
    }

    async getAllPurchases(id: number) {
        return await this.prisma.purchasedCource.findMany({
            where: {
                status: {
                    not: 'DELETED'
                },
                userId: id
            },
            include: {
                user: true,
                cource: {
                    select: {
                        name: true,
                        banner: true,
                        intro_video: true,
                        mentor: {
                            select: {
                                user: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                purchasedAt: 'desc',
            },
        });
    }

    async purchaseCource(payload: PurchaseDto, userId: number) {
        const existing = await this.prisma.purchasedCource.findUnique({
            where: {
                userId_courceId: {
                    userId,
                    courceId: payload.courceId
                }
            }
        })

        if (existing) {
            throw new ConflictException('You already purchased this course')    
        }

        await this.prisma.purchasedCource.create({
            data: {
                userId,
                courceId: payload.courceId,
            }
        })

        return {
            success: true,
            message: 'Cource purchased successfully!'
        }
    }

    async approvePayment(userId: number, courceId: number) {
        const purchase = await this.prisma.purchasedCource.findUnique({
            where: {
                userId_courceId: {
                    userId,
                    courceId
                }
            }
        })

        if (!purchase) {
            throw new NotFoundException('Purchase not found with this userId or courcecId')
        }

        if (purchase.status === PaymentStatus.COMPLETED) {
            throw new ConflictException('Payment already approved')
        }

        return await this.prisma.purchasedCource.update({
            where: {
                userId_courceId: {
                    userId, courceId
                }
            },
            data: {
                status: PaymentStatus.COMPLETED
            },
            include: {
                user: true,
                cource: true
            }
        })
    }
}
