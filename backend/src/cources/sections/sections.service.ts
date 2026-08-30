import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { SectionsDto, UpdateSectionDto } from './dto/sections.dto';

@Injectable()
export class SectionsService {
    constructor(private prisma: PrismaService) { }

    async getAllSections() {
        const sections = await this.prisma.sections.findMany({
            select: {
                id: true,
                name: true,
                cources: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        return {
            success: true,
            data: sections
        }
    }

    async getSectionsCource(courceId: number) {
        const sections = await this.prisma.sections.findMany({
            where: {
                courcesId: courceId,
            },

            select: {
                id: true,
                name: true,
            }

        });

        return {
            success: true,
            data: sections,
        };
    }

    async getOneSection(id: number) {
        const section = await this.prisma.sections.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                cources: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        return {
            success: true,
            data: section
        }
    }

    async createSection(payload: SectionsDto) {
        await this.prisma.sections.create({
            data: {
                name: payload.name,
                courcesId: payload.courceId
            }
        })

        return {
            success: true,
            message: 'Section created successfully!'
        }
    }

    async updateSection(payload: UpdateSectionDto, id: number) {
        await this.prisma.sections.update({
            where: {
                id: id
            },
            data: {
                ...payload
            }
        })

        return {
            success: true,
            message: 'Section updated successfully!'
        }
    }

    async deleteSection(id: number) {
        await this.prisma.sections.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Section deleted successfully!'
        }
    }
}
