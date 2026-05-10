import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CreateComplianceDocumentDto } from './create-compliance-document.dto';

export class CreatePartnerVehicleDto {
  @IsString()
  @IsOptional()
  partnerShopId?: string;

  @IsString()
  plateNumber!: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  capacityKg?: number;

  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
