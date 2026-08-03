import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { HomeworksService } from './homeworks.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from '@prisma/client';
import { Role } from 'src/decorator/roles';
import { HomeworkDto, UpdateHomeworkDto } from './dto/homework.dto';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiBearerAuth()
@Controller('homeworks')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN)
export class HomeworksController {
    constructor(private readonly homeworkService: HomeworksService) { }

    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Get('homeworks/:lessonId')
    getAllMaterials(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.homeworkService.getAllHomeworks(lessonId)
    }


    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Get('homeworks/:homeworkId')
    getOneHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
        return this.homeworkService.getOneHomework(homeworkId)
    }


    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './src/uploads/homeworks',

                filename: (req, file, cb) => {
                    const filename =
                        Date.now() +
                        '-' +
                        Math.round(Math.random() * 1e9) +
                        extname(file.originalname);

                    cb(null, filename);
                },
            }),

            fileFilter: (req, file, cb) => {
                const allowedExtensions = [
                    '.jpg','.png','.svg',
                    '.txt',
                    '.zip',
                ];

                if (!allowedExtensions.includes(extname(file.originalname).toLowerCase())) {
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
                lessonId: {
                    type: 'number',
                },
                description: {
                    type: 'string',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['lessonId', 'description'],
        },
    })
    @Post('homeworks')
    createHomework( 
        @Body() payload: HomeworkDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.homeworkService.createHomework(payload, file?.filename)
    }


    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Patch('homeworks/:homeworkId')
    updateHomework(
        @Body() payload: UpdateHomeworkDto,
        @Param('homeworkId', ParseIntPipe) homeworkId: number
    ) {
        return this.homeworkService.updateHomework(payload, homeworkId)
    }


    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Delete('homeworks/:homeworkId')
    deleteHomework(@Param('homeworkId', ParseIntPipe) homeworkId: number) {
        return this.homeworkService.deleteHomework(homeworkId)
    }
}
