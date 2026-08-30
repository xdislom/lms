import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CourcesDto, UpdateCourcesDto } from './dto/cources.dto';

@Injectable()
export class CourcesService {
    constructor(private prisma: PrismaService) { }

    async getAllCources() {
        const cources = await this.prisma.cources.findMany({
            select: {
                id: true,
                banner: true,
                intro_video: true,
                name: true,
                level: true,
                price: true,
                mentor: {
                    select:{
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
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
        const cource = await this.prisma.cources.findMany({
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

                sections: {
                    select: {
                        id: true,
                        name: true,
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

        const category = await this.prisma.categories.findUnique({
            where: {
                id: payload.categoriesId
            }
        })

        if (!category) {
            throw new NotFoundException('Category not found with this id')
        }

        const mentor = await this.prisma.mentor.findUnique({
            where: {
                userId: payload.mentorId
            },
        })

        if (!mentor) {
            throw new NotFoundException('Mentor not found with this id')
        }

        await this.prisma.cources.create({
            data: {
                banner: banner.filename,
                intro_video: introVideo.filename,
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
            messsage: 'Cource created successfully!'
        }
    }

    async updateCource(payload: UpdateCourcesDto, id: number) {
        const exsistName = await this.prisma.cources.findUnique({
            where: {
                name: payload.name
            }
        })

        if (exsistName?.name === payload.name) {
            throw new ConflictException('This name is already exsist')
        }
        
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
