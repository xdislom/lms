import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { ExamDto, UpdateExamDto } from './dto/exam.dto';

@Injectable()
export class ExamsService {
    constructor(private prisma: PrismaService) { }

    async getAllExams(lessonId: number) {
        const exams = await this.prisma.exam.findMany({
            where: {
                lessonId: lessonId
            },
            select: {
                id: true,
                question: true,
                variantA: true,
                variantB: true,
                variantC: true,
                variantD: true,
                answer: true
            }
        })

        return {
            success: true,
            data: exams
        }
    }

    async getOneExam(id: number) {
        const exam = await this.prisma.exam.findUnique({
            where: {
                id: id
            }
        })

        return {
            success: true,
            data: exam
        }
    }

    async createExam(payload: ExamDto) {
        await this.prisma.exam.create({
            select: {
                question: true,
                variantA: true,
                variantB: true,
                variantC: true,
                variantD: true
            },
            data: {
                lessonId: payload.lessonId,
                question: payload.question,
                variantA: payload.variantA,
                variantB: payload.variantB,
                variantC: payload.variantC,
                variantD: payload.variantD,
                answer: payload.answer,
            }
        })

        return {
            success: true,
            message: 'Exam craeted successfully!'
        }
    }

    async updateExam(payload: UpdateExamDto, examId: number) {
        await this.prisma.exam.update({
            where: {
                id: examId
            },
            data: {
                question: payload.question,
                variantA: payload.variantA,
                variantB: payload.variantB,
                variantC: payload.variantC,
                variantD: payload.variantD,
                answer: payload.answer,
            }
        })

        return {
            success: true,
            message: 'Exam upadted successfully!'
        }
    }

    async deleteExam(examId: number) {
        await this.prisma.exam.delete({
            where: {
                id: examId
            }
        })

        return {
            success: true,
            message: 'Exam deleted successfully!'
        }
    }
}
