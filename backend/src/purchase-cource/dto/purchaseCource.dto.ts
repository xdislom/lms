import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNumber } from "class-validator"

export class PurchaseDto {
    @ApiProperty({example: 5})
    @IsInt()
    courceId!: number
}