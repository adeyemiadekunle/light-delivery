import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateHubDto {
  @ApiProperty({ example: 'Ikeja Hub' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'City id containing this hub' })
  @IsString()
  @IsNotEmpty()
  cityId!: string;

  @ApiProperty({ description: 'Required local area id used to group hubs into service zones' })
  @IsString()
  @IsNotEmpty()
  localAreaId!: string;

  @ApiPropertyOptional({ example: '12 Allen Avenue, Ikeja' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Optional postcode for future address precision',
    example: '100271',
  })
  @IsString()
  @IsOptional()
  postcode?: string;

  @ApiPropertyOptional({ minimum: -90, maximum: 90, example: 6.6018 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ minimum: -180, maximum: 180, example: 3.3515 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;
}
