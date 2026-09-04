import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UnsupportedMediaTypeException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourcesService } from './cources.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import Multer, { diskStorage } from 'multer';
import { CourcesDto, UpdateCourcesDto } from './dto/cources.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/decorator/roles';
import { join } from 'path';


@Controller('cources')
export class CourcesController {
    constructor(private readonly courcesService: CourcesService) { }

    @Get('cources/all')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    getAllCources() {
        return this.courcesService.getAllCources()
    }

    @Get('cources/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    getOneCource(@Param('id', ParseIntPipe) id: number) {
        return this.courcesService.getOneCource(id)
    }

    @ApiBearerAuth() 
    @UseGuards(AuthGuard, RolesGuard)
    @Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.MENTOR)
    @Post('cources')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'banner', maxCount: 1 },
                { name: 'intro_video', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        if (file.fieldname === 'banner') {
                            cb(null, join(process.cwd(), 'src/uploads/images'))
                        } else {
                            cb(null, join(process.cwd(), './src/uploads/videos'))
                        }
                    },

                    filename: (req, file, cb) => {
                        const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' +
                            file.mimetype.split('/')[1];

                        cb(null, filename);
                    },
                }),

                fileFilter: (req, file, cb) => {
                    if (file.fieldname === 'banner') {
                        const allowedImage = ['jpg', 'jpeg', 'png', 'svg'];

                        if (!allowedImage.includes(file.mimetype.split('/')[1])) {
                            return cb(new UnsupportedMediaTypeException(), false);
                        }
                    }

                    if (file.fieldname === 'intro_video') {
                        const allowedVideo = ['mp4'];

                        if (!allowedVideo.includes(file.mimetype.split('/')[1])) {
                            return cb(new UnsupportedMediaTypeException(), false);
                        }
                    }

                    cb(null, true);
                },
            },
        ),
    )
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                banner: {
                    type: 'string',
                    format: 'binary',
                },
                intro_video: {
                    type: 'string',
                    format: 'binary',
                },
                name: { type: 'string' },
                description: { type: 'string' },
                level: {
                    type: 'string',
                    enum: [
                        'BEGINNER',
                        'ELEMENTRY',
                        'PRE_INTERMIDIATE',
                        'INTERMIDIATE',
                        'ADVANCED',
                    ],
                },
                price: { type: 'number' },
                categoriesId: { type: 'number' },
                mentorId: { type: 'number' }
            },
        },
    })
    createCource(
        @Body() payload: CourcesDto,
        @UploadedFiles()
        files: {
            banner?: Express.Multer.File[];
            intro_video?: Express.Multer.File[];
        },
    ) {

        return this.courcesService.createCource(payload, files);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.MENTOR)
    @Patch('cources/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    updateCource(
        @Body() payload: UpdateCourcesDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.courcesService.updateCource(payload, id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.MENTOR)
    @Delete('cources/:id')
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })
    deleteCource(@Param('id', ParseIntPipe) id: number) {
        return this.courcesService.deleteCource(id)
    }
}
