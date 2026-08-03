import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UnsupportedMediaTypeException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from '@prisma/client';
import { Role } from 'src/decorator/roles';


@ApiBearerAuth()
@Controller('lessons')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN)
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) { }

    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Get('section/:sectionId')
    getAllLessons(@Param('sectionId', ParseIntPipe) sectionId: number) {
        return this.lessonsService.getAllLessons(sectionId)
    }



    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Get('lesson/:id')
    getOneLesson(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.getOneLesson(id)
    }



    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Post('lesson')
    @UseInterceptors(
        FileInterceptor('intro_video', {
            storage: diskStorage({
                destination: './src/uploads/videos',

                filename: (req, file, cb) => {
                    const filename =
                        Date.now() +
                        '-' +
                        Math.round(Math.random() * 1e9) +
                        '.' +
                        file.mimetype.split('/')[1];

                    cb(null, filename);
                },
            }),

            fileFilter: (req, file, cb) => {
                const allowedVideo = ['mp4'];

                if (!allowedVideo.includes(file.mimetype.split('/')[1])) {
                    return cb(new UnsupportedMediaTypeException(), false);
                }

                cb(null, true);
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                intro_video: {
                    type: 'string',
                    format: 'binary',
                },
                name: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                sectionId: {
                    type: 'number'
                }
            },
            required: ['intro_video', 'name', 'description'],
        },
    })
    createLesson(
        @Body() payload: LessonDto,
        @UploadedFile() introVideo: Express.Multer.File
    ) {
        return this.lessonsService.createLesson(payload, introVideo);
    }



    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Patch('lesson/:id')
    updateLesson(
        @Body() payload: UpdateLessonDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.lessonsService.updateLesson(payload, id)
    }



    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Delete('lesson/:id')
    deleteLesson(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.deleteLesson(id)
    }
}
