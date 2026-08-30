import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class ResetDto {
    @ApiProperty({example: "+998997652928"})
    @IsString()
    phone!: string

    @ApiProperty({example: "string"})
    @IsString()
    password!: string
}
