import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async getAllCategories() {
        const categories = await this.prisma.categories.findMany({
            select: {
                id: true,
                name: true,
            }
        })

        return {
            success: true,
            data: categories
        }
    }

    async getOneCategory(id: number) {
        const category = await this.prisma.categories.findFirst({
            where: {
                id: id
            }
        })

        return {
            success: true,
            data: category
        }
    }

    async createCategory(payload: CategoryDto) {
        await this.prisma.categories.create({
            data: {
                name: payload.name,
            } 
        })

        return {
            success: true,
            message: 'Category created successfully!'
        }
    }

    async updateCategory(payload: UpdateCategoryDto, id: number) {
        await this.prisma.categories.update({
            where: {
                id: id
            },
            data: {
                ...payload
            }
        })

        return {
            success: true,
            message: 'Category updated successfully!'
        }
    }

    async deleteCategories(id: number) {
        await this.prisma.categories.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Category deleted successfully!'
        }
    }
}
