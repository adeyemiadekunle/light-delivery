import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: '12 Allen Avenue' })
  @IsString()
  line1!: string;

  @ApiPropertyOptional({ example: 'Suite 4' })
  @IsString()
  @IsOptional()
  line2?: string;

  @ApiPropertyOptional({ description: 'Known city id when the address is mapped to a city' })
  @IsString()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({
    description: 'Known local area id when the address is mapped to a local area',
  })
  @IsString()
  @IsOptional()
  localAreaId?: string;

  @ApiPropertyOptional({ example: 'Ikeja' })
  @IsString()
  @IsOptional()
  freeformCity?: string;

  @ApiPropertyOptional({ example: 'Lagos' })
  @IsString()
  @IsOptional()
  freeformState?: string;

  @ApiPropertyOptional({
    description: 'Optional postcode for future address precision',
    example: '100271',
  })
  @IsString()
  @IsOptional()
  postcode?: string;

  @ApiPropertyOptional({
    description: 'Optional Google Places id selected by the user during address lookup',
    example: 'ChIJ2Y1b3YOOxRARKGZLG0e7XGQ',
  })
  @IsString()
  @IsOptional()
  googlePlaceId?: string;

  @ApiPropertyOptional({
    description: 'Optional full address returned by the map provider',
    example: '12 Allen Avenue, Ikeja, Lagos, Nigeria',
  })
  @IsString()
  @IsOptional()
  formattedAddress?: string;

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
