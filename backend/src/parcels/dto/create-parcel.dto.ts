import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateParcelDto {
  @ApiProperty({ enum: ServiceType, example: ServiceType.HUB_TO_HUB })
  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @ApiPropertyOptional({ description: 'Internal sender customer id' })
  @IsString()
  @IsOptional()
  senderCustomerId?: string;

  @ApiPropertyOptional({ description: 'Internal merchant id for business parcels' })
  @IsString()
  @IsOptional()
  merchantId?: string;

  @ApiPropertyOptional({ description: 'Internal origin hub id' })
  @IsString()
  @IsOptional()
  originHubId?: string;

  @ApiPropertyOptional({ description: 'Internal destination hub id' })
  @IsString()
  @IsOptional()
  destinationHubId?: string;

  @ApiProperty({ description: 'Sender name copied into the parcel for return handling' })
  @IsString()
  @IsNotEmpty()
  senderName!: string;

  @ApiProperty({ description: 'Sender phone copied into the parcel for return handling' })
  @IsString()
  @IsNotEmpty()
  senderPhone!: string;

  @ApiProperty({ description: 'Sender return address copied into the parcel' })
  @IsString()
  @IsNotEmpty()
  senderAddress!: string;

  @ApiPropertyOptional({ description: 'Optional sender postcode' })
  @IsString()
  @IsOptional()
  senderPostcode?: string;

  @ApiPropertyOptional({ minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  senderLatitude?: number;

  @ApiPropertyOptional({ minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  senderLongitude?: number;

  @ApiProperty({ example: 'Chika Okafor' })
  @IsString()
  @IsNotEmpty()
  receiverName!: string;

  @ApiProperty({ example: '08032222222' })
  @IsString()
  @IsNotEmpty()
  receiverPhone!: string;

  @ApiPropertyOptional({ example: '5 Admiralty Way, Lekki' })
  @IsString()
  @IsOptional()
  receiverAddress?: string;

  @ApiPropertyOptional({ description: 'Optional receiver postcode' })
  @IsString()
  @IsOptional()
  receiverPostcode?: string;

  @ApiPropertyOptional({ minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  receiverLatitude?: number;

  @ApiPropertyOptional({ minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  receiverLongitude?: number;

  @ApiProperty({ minimum: 0.01, example: 2.5 })
  @IsNumber()
  @Min(0.01)
  weightKg!: number;
}
