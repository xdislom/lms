import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MaterialDto {
  @ApiProperty({example: 1})
  @Type(() => Number)
  @IsNumber()
  lessonId!: number;

  @ApiProperty({example: 'qilililili'})
  @IsString()
  description!: string;
}

export class UpdateMaterialDto extends PartialType(MaterialDto) { }