import { ComplianceDocumentType } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateComplianceDocumentDto {
  @IsEnum(ComplianceDocumentType)
  type!: ComplianceDocumentType;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsString()
  @IsOptional()
  storageKey?: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsDateString()
  @IsOptional()
  issuedAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
