import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    async getAllLessons(sectionId: number) {
        const lessons = await this.prisma.lessons.findMany({
            where: {
                sectionId: sectionId,
            },
            select: {
                id: true,
                name: true,
                description: true,
                introVideo: true,
                section: {
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
                },
            },
        })

        return {
            success: true,
            data: lessons
        }
    }

    async getOneLesson(id: number) {
        const lesson = await this.prisma.lessons.findFirst({
            where: {
                id: id
            }
        })

        return {
            success: true,
            data: lesson
        }
    }

    async createLesson(payload: LessonDto, introVideo: Express.Multer.File,) {
        await this.prisma.lessons.create({
            select: {
                id: true,
                sectionId: true,
                name: true,
                description: true,
                introVideo: true
            },
            data: {
                ...payload,
                introVideo: introVideo.filename,
            }
        })

        if (!introVideo) {
            throw new BadRequestException("Intro video is required");
        }

        return {
            success: true,
            message: 'Lesson created successfully!'
        }
    }

    async updateLesson(payload: UpdateLessonDto, id: number) {
        await this.prisma.lessons.update({
            where: {
                id: id
            },
            data: {
                ...payload
            }
        })

        return {
            success: true,
            message: 'Lesson updated successfully!'
        }
    }

    async deleteLesson(id: number) {
        await this.prisma.lessons.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: 'Lesson deleted successfully!'
        }
    }
}
