import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialDto, UpdateMaterialDto } from './dto/material.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { Roles } from '@prisma/client';
import { Role } from 'src/decorator/roles';


@ApiBearerAuth()
@Controller('materials')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.STUDENT)
export class MaterialsController {
    constructor(private readonly materialsService: MaterialsService) { }

    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Get('lesson/:lessonId')
    getAllMaterials(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.materialsService.getAllMaterials(lessonId)
    }


    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Get('material/:id')
    getOneMaterial(@Param('id', ParseIntPipe) id: number) {
        return this.materialsService.getOneMaterial(id)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Post('material')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './src/uploads/materials',

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
                    '.png','.jpg','.svg',
                    '.pdf',
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
            required: ['lessonId', 'description', 'file'],
        },
    })
    createMaterial(@Body() payload: MaterialDto, @UploadedFile() file: Express.Multer.File) {
        return this.materialsService.createMaterial(payload, file)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Patch('material/:id')
    updateMaterial(
        @Body() payload: UpdateMaterialDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.materialsService.updateMaterial(payload, id)
    }


    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Delete('material/:id')
    deleteMaterial(@Param('id', ParseIntPipe) id: number) {
        return this.materialsService.deleteMaterial(id)
    }
}
