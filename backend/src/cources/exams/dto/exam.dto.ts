import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Answer } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsNumber, IsString } from "class-validator"

export class ExamDto {
    @ApiProperty({ example: 1 })
    @Type(() => Number)
    @IsNumber()
    lessonId!: number

    @ApiProperty({ example: 'string' })
    @IsString()
    question!: string

    @ApiProperty({ example: 'string' })
    @IsString()
    variantA!: string

    @ApiProperty({ example: 'string' })
    @IsString()
    variantB!: string

    @ApiProperty({ example: 'string' })
    @IsString()
    variantC!: string

    @ApiProperty({ example: 'string' })
    @IsString()
    variantD!: string

    @ApiProperty({ enum: Answer })
    @IsEnum(Answer)
    answer!: Answer;
}

export class UpdateExamDto extends PartialType(ExamDto) {}