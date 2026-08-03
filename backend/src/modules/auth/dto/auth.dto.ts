import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsMobilePhone, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class AuthDto {
    @ApiProperty({ example: 'string' })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({ example: 'string' })
    @IsMobilePhone("uz-UZ")
    @IsPhoneNumber()
    phone!: string

    @ApiProperty({ example: 'string' })
    @IsString()
    @MinLength(6)
    password!: string

    @ApiProperty({ example: '3' })
    @Type(() => Number)
    @IsNumber()
    courceId!: Number

    @ApiProperty({ example: 'example@gmail.com' })
    @IsEmail()
    email!: string
}

export class LoginDto {
    @ApiProperty({example: '+998997652928'})
    @IsString()
    phone!: string;

    @ApiProperty({example: 'Islom15'})
    @IsString()
    password!: string;
}
