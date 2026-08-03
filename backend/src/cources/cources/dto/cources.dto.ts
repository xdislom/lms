import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CourceLevel } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CourcesDto {
    @ApiProperty({ example: "Name" })
    @IsNotEmpty()
    @IsString()
    name!: string

    @ApiProperty({ example: "Yaxshi kurs" })
    @IsNotEmpty()
    @IsString()
    description!: string

    @ApiProperty({ enum: CourceLevel })
    @IsNotEmpty()
    @IsEnum(CourceLevel)
    level!: CourceLevel

    @ApiProperty({ example: 1500000 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    price!: number

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    categoriesId!: number

    @ApiProperty({ example: 2 })
    @Type(() => Number)
    @IsNumber()
    mentorId!: number;
}

export class UpdateCourcesDto extends PartialType(CourcesDto) { }
