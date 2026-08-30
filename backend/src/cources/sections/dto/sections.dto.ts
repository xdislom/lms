import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsString } from "class-validator"

export class SectionsDto {
    @ApiProperty({example: 'Name'})
    @IsString()
    name!: string

    @ApiProperty({example: 2})
    @Type(() => Number)
    @IsNumber()
    courceId!: number   
}

export class UpdateSectionDto extends PartialType(SectionsDto) { }
