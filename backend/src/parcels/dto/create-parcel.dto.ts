import { ServiceType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateParcelDto {
  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @IsString()
  @IsOptional()
  senderCustomerId?: string;

  @IsString()
  @IsOptional()
  merchantId?: string;

  @IsString()
  @IsOptional()
  originHubId?: string;

  @IsString()
  @IsOptional()
  destinationHubId?: string;

  @IsString()
  @IsNotEmpty()
  senderName!: string;

  @IsString()
  @IsNotEmpty()
  senderPhone!: string;

  @IsString()
  @IsNotEmpty()
  senderAddress!: string;

  @IsString()
  @IsOptional()
  senderPostcode?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  senderLatitude?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  senderLongitude?: number;

  @IsString()
  @IsNotEmpty()
  receiverName!: string;

  @IsString()
  @IsNotEmpty()
  receiverPhone!: string;

  @IsString()
  @IsOptional()
  receiverAddress?: string;

  @IsString()
  @IsOptional()
  receiverPostcode?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  receiverLatitude?: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  receiverLongitude?: number;

  @IsNumber()
  @Min(0.01)
  weightKg!: number;
}
