import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CourcesDto, UpdateCourcesDto } from './dto/cources.dto';
import { Roles } from '@prisma/client';

@Injectable()
export class CourcesService {
    constructor(private prisma: PrismaService) { }

    async getAllCources() {
        const cources = await this.prisma.cources.findMany({
            select: {
                id: true,
                banner: true,
                name: true,
                level: true,
                price: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
                    }
                }
            }
        })


        return {
            success: true,
            data: cources
        }
    }

    async getOneCource(id: number) {
        const cource = await this.prisma.cources.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                banner: true,
                intro_video: true,
                name: true,
                description: true,
                level: true,
                price: true,

                users: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        role: true,
                    },
                    where: {
                        role: Roles.STUDENT
                    }
                },

                mentor: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                role: true
                            }
                        }
                    },
                },

                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return {
            success: true,
            data: cource
        }
    }

    async createCource(payload: CourcesDto, files: {
        banner?: Express.Multer.File[], intro_video?: Express.Multer.File[]
    }) {


        const banner = files.banner?.[0];
        const introVideo = files.intro_video?.[0];

        if (!banner) {
            throw new BadRequestException('Banner is required')
        }

        if (!introVideo) {
            throw new BadRequestException('Intro video is required')
        }

        const category = await this.prisma.categories.findFirst({
            where: {
                id: payload.categoriesId
            }
        })

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        const mentor = await this.prisma.mentor.findFirst({
            where: {
                userId: payload.mentorId
            },
        })

        if (!mentor) {
            throw new NotFoundException('Mentor not found')
        }

        await this.prisma.cources.create({
            data: {
                banner: banner.originalname,
                intro_video: introVideo.originalname,
                name: payload.name,
                description: payload.description,
                level: payload.level,
                price: payload.price,
                categoryId: payload.categoriesId,
                mentorId: mentor.id
            }
        })

        return {
            success: true,
            messsage: 'Cource create successfully!'
        }
    }

    async updateCource(payload: UpdateCourcesDto, id: number) {
        const cource = await this.prisma.cources.update({
            where: {
                id: id
            },
            data: {
                ...payload
            }
        })

        return {
            success: true,
            data: cource
        }
    }

    async deleteCource(id: number) {
        await this.prisma.cources.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Cource deleted successfully!'
        }
    }
}
