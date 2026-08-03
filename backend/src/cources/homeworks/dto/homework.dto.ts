import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class HomeworkDto {
    @ApiProperty({example: 1})
    @Type(() => Number)
    @IsNumber()
    lessonId!: number

    @ApiProperty({example: 'string'})
    @IsString()
    description!: string
}

export class UpdateHomeworkDto extends PartialType(HomeworkDto) {}