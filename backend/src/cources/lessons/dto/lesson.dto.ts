import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsString } from "class-validator"

export class LessonDto {
    @ApiProperty({ example: 'Name' })
    @IsString()
    name!: string

    @ApiProperty({ example: 'Yaxshi kurs' })
    @IsString()
    description!: string

    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    sectionId!: number
}

export class UpdateLessonDto extends PartialType(LessonDto) { }
