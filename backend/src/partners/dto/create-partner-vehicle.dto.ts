import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CreateComplianceDocumentDto } from './create-compliance-document.dto';

export class CreatePartnerVehicleDto {
  @ApiPropertyOptional({
    description: 'Internal partner shop id that owns or operates the vehicle',
  })
  @IsString()
  @IsOptional()
  partnerShopId?: string;

  @ApiProperty({ example: 'ABC-123-LA' })
  @IsString()
  plateNumber!: string;

  @ApiPropertyOptional({ example: 'Toyota' })
  @IsString()
  @IsOptional()
  make?: string;

  @ApiPropertyOptional({ example: 'HiAce' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ minimum: 0, example: 1200 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  capacityKg?: number;

  @ApiPropertyOptional({ type: () => CreateComplianceDocumentDto, isArray: true })
  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
