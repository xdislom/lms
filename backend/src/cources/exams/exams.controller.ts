import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from '@prisma/client';
import { Role } from 'src/decorator/roles';
import { ExamDto, UpdateExamDto } from './dto/exam.dto';

@ApiBearerAuth()
@Controller('exams')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN)
export class ExamsController {
    constructor(private readonly examService: ExamsService) {}

    @ApiOperation({ summary: `${Roles.MENTOR}` })
    @Get('exam/:lessonId')
    getAllExams(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.examService.getAllExams(lessonId)
    }

    @ApiOperation({ summary: `${Roles.MENTOR}` })
    @Get('exam/:id')
    getOneExam(@Param('id', ParseIntPipe) id: number) {
        return this.examService.getOneExam(id)
    }

    @ApiOperation({ summary: `${Roles.MENTOR}`})
    @Post('exam')
    createExam(@Body() payload: ExamDto) {
        return this.examService.createExam(payload)
    } 

    @ApiOperation({ summary: `${Roles.MENTOR}`})
    @Patch('exam/:examId')
    updateExam(
        @Body() payload: UpdateExamDto,
        @Param('examId', ParseIntPipe) examId: number
    ) {
        return this.examService.updateExam(payload, examId)
    }

    @ApiOperation({ summary: `${Roles.MENTOR}`})
    @Delete('exam/:examId')
    deleteExam(@Param('examId', ParseIntPipe) examId: number) {
        return this.examService.deleteExam(examId)
    }
}
