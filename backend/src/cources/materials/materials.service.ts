import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { MaterialDto, UpdateMaterialDto } from './dto/material.dto';

@Injectable()
export class MaterialsService {
    constructor(private prisma: PrismaService) { }

    async getAllMaterials(lessonId: number) {
        const materials = await this.prisma.materials.findMany({
            where: {
                lessonId: lessonId
            },
            select: {
                id: true,
                description: true,
                lesson: {
                    select: {
                        name: true
                    }
                },
                materialFiles: {
                    select: {
                        id: true,
                        file: true
                    }
                }
            }
        })

        return {
            success: true,
            data: materials
        }
    }

    async getOneMaterial(id: number) {
        const material = await this.prisma.materials.findFirst({
            where: {
                id: id
            }
        })

        return {
            success: true,
            data: material
        }
    }

    async createMaterial(payload: MaterialDto, file: Express.Multer.File) {
        const material = await this.prisma.materials.create({
            data: {
                lessonId: payload.lessonId,
                description: payload.description,
            },
        })

        await this.prisma.materialFile.create({
            data: {
                materialId: material.id,
                file: file.filename,
            },
        });

        return {
            success: true,
            message: 'Material created successfully!'
        }
    }

    async updateMaterial(payload: UpdateMaterialDto, id: number) {
        await this.prisma.materials.update({
            where: {
                id: id
            },
            data: {
                lessonId: payload.lessonId,
                description: payload.description
            }
        })

        return {
            success: true,
            message: 'Material updated successfully!'
        }
    }

    async deleteMaterial(id: number) {
        await this.prisma.materials.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Material deleted successfully!'
        }
    }
}
