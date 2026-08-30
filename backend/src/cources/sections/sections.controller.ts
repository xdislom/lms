import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsDto, UpdateSectionDto } from './dto/sections.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles-guard';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/decorator/roles';

@ApiBearerAuth()
@Controller('sections')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN, Roles.STUDENT)
export class SectionsController {
    constructor(private readonly sectionsService: SectionsService) { }

    @ApiOperation({ summary: `${Roles.ADMIN}, ${Roles.MENTOR}` })
    @Get('section/all')
    getAllSections() {
        return this.sectionsService.getAllSections()
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Get("cource/:courceId")
    getSectionsByCource(
        @Param("courceId", ParseIntPipe) courceId: number,
    ) {
        return this.sectionsService.getSectionsCource(courceId);
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Get('section/:id')
    getOneSection(@Param('id', ParseIntPipe) id: number) {
        return this.sectionsService.getOneSection(id)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Post('section')
    createSection(@Body() payload: SectionsDto) {
        return this.sectionsService.createSection(payload)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Patch('section/:id')
    updateSection(
        @Body() payload: UpdateSectionDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.sectionsService.updateSection(payload, id)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Delete('section/:id')
    deleteSection(@Param('id', ParseIntPipe) id: number) {
        return this.sectionsService.deleteSection(id)
    }
}
