import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { HomeworkDto, UpdateHomeworkDto } from './dto/homework.dto';

@Injectable()
export class HomeworksService {
    constructor(private prisma: PrismaService) { }

    async getAllHomeworks(lessonId: number) {
        const LessonId = await this.prisma.lessons.findUnique({
            where: {
                id: lessonId
            }
        })
        
        if(!LessonId) {
            throw new NotFoundException('Lesson Id not found with this Id')
        }
        
        const homeworks = await this.prisma.homeworks.findMany({
            where: {
                lessonId: lessonId
            },
            select: {
                id: true,
                description: true,
                file: true
            }
        })

        return {
            success: true,
            data: homeworks
        }
    }


    async getOneHomework(homeworkId: number) {
        const existHomework = await this.prisma.homeworks.findUnique({
            where: {
                id: homeworkId
            }
        })

        if(!existHomework) {
            throw new NotFoundException('Homework Id not found with this Id')
        }
        
        const homework = await this.prisma.homeworks.findUnique({
            where: {
                id: homeworkId
            }
        })

        return {
            success: true,
            data: homework
        }
    }

    async createHomework(payload: HomeworkDto, filename?: string) {
        await this.prisma.homeworks.create({
            data: {
                lessonId: payload.lessonId,
                description: payload.description,
                file: filename
            }
        })

        return {
            success: true,
            message: 'Homework create successfully!'
        }
    }

    async updateHomework(payload: UpdateHomeworkDto, homeworkId: number) {
        const existHomeworkId = await this.prisma.homeworks.findUnique({
            where: {
                id: homeworkId
            }
        })

        if (!existHomeworkId) {
            return new NotFoundException('Homework Id not found with this id')
        }

        await this.prisma.homeworks.update({
            where: {
                id: homeworkId
            },
            data: {
                ...payload
            }
        })

        return {
            success: true,
            message: 'Homework updated successfully!'
        }
    }

    async deleteHomework(homeworkId: number) {
        const existHomeworkId = await this.prisma.homeworks.findUnique({
            where: {
                id: homeworkId
            }
        })

        if (!existHomeworkId) {
            return new NotFoundException('Homework Id not found with this id')
        }

        await this.prisma.homeworks.delete({
            where: {
                id: homeworkId
            }
        })

        return {
            success: true,
            message: 'Homework deleted successfully!'
        }
    }
}
