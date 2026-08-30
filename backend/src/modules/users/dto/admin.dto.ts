import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsEmpty, IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class AdminDto {
    @ApiProperty({ example: 'Name' })
    @IsString()
    @MaxLength(30)
    @MinLength(3)
    name!: string

    @ApiProperty({ example: '+998999999999' })
    @IsMobilePhone('uz-UZ')
    phone!: string

    email?: string

    @ApiProperty({ example: 'Qwerty' })
    @IsString()
    password!: string
}

export class UpdateAdminDto extends PartialType(AdminDto) { }

export class AssistentDto {
    @ApiProperty({ example: 'Name' })
    @IsString()
    @IsNotEmpty()
    name!: string


    @ApiProperty({ example: '+998996666666' })
    @IsPhoneNumber('UZ')
    @IsNotEmpty()
    phone!: string


    @ApiProperty({ example: 'Qwerty' })
    @IsString()
    @IsNotEmpty()
    password!: string
}

export class UpdateAssistentDto extends PartialType(AssistentDto) { }

export class MentorDto {
    @ApiProperty({ example: 'Name' })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({ example: '+998997777777' })
    @IsPhoneNumber('UZ')
    @IsNotEmpty()
    phone!: string

    @ApiProperty({ example: 'Qwerty' })
    @IsString()
    @IsNotEmpty()
    password!: string

    @IsOptional()
    @IsEmail()
    email!: string

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    experience!: number

    @IsOptional()
    @IsString()
    job!: string

    @IsOptional()
    @IsString()
    web_link!: string

    @IsOptional()
    @IsString()
    description!: string

    @IsOptional()
    @IsString()
    facebook!: string

    @IsOptional()
    @IsString()
    telegram!: string

    @IsOptional()
    @IsString()
    linkedIn!: string

    @IsOptional()
    @IsString()
    instagtam!: string

    @IsOptional()
    @IsString()
    github!: string
}

export class UpdateMentorDto extends PartialType(MentorDto) { }


export class StudentsDto {
    @ApiProperty({ example: 'Name' })
    @IsString()
    name!: string

    @ApiProperty({ example: '+998998888888' })
    @IsPhoneNumber('UZ')
    @IsString()
    phone!: string

    @ApiProperty({ example: 'Qwerty' })
    @IsString()
    password!: string
}

export class UpdateStudentDto extends PartialType(StudentsDto) { }
