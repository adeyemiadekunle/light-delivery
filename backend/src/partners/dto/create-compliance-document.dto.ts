import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplianceDocumentType } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateComplianceDocumentDto {
  @ApiProperty({ enum: ComplianceDocumentType, example: ComplianceDocumentType.GOVERNMENT_ID })
  @IsEnum(ComplianceDocumentType)
  type!: ComplianceDocumentType;

  @ApiPropertyOptional({ example: 'DL-123456' })
  @IsString()
  @IsOptional()
  documentNumber?: string;

  @ApiPropertyOptional({ example: 'drivers/tunde-ade/license.pdf' })
  @IsString()
  @IsOptional()
  storageKey?: string;

  @ApiPropertyOptional({ example: 'license.pdf' })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ format: 'date-time' })
  @IsDateString()
  @IsOptional()
  issuedAt?: string;

  @ApiPropertyOptional({ format: 'date-time' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
