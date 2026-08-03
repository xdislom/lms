import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CategoryDto {
    @ApiProperty({ example: 'Name' })
    @IsString()
    name!: string
}

export class UpdateCategoryDto extends PartialType(CategoryDto) { }
