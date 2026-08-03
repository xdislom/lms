import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { Role } from 'src/decorator/roles';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles-guard';

@ApiBearerAuth()
@Controller('category')
@UseGuards(AuthGuard, RolesGuard)
@Role(Roles.ADMIN, Roles.SUPERADMIN)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }
    @ApiOperation({ summary: 'ADMIN, SUPERADMIN' })


    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Get('categiry/all')
    getAllCategories() {
        return this.categoryService.getAllCategories()
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Get('category/:id')
    getOneCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getOneCategory(id)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Post('category')
    createCategory(@Body() payload: CategoryDto) {
        return this.categoryService.createCategory(payload)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Patch('category/:id')
    updateCategory(
        @Body() payload: UpdateCategoryDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.categoryService.updateCategory(payload, id)
    }



    @ApiOperation({summary: `${Roles.ADMIN}, ${Roles.MENTOR}`})
    @Delete('category/:id')
    deleteCategories(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.deleteCategories(id)
    }
}
