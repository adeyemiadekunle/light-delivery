import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';
import { CreateComplianceDocumentDto } from './create-compliance-document.dto';

export class CreateDriverDto {
  @ApiProperty({ example: 'Tunde Ade' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '08031111111' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ description: 'Internal user id when this driver has login access' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ type: () => CreateAddressDto })
  @IsOptional()
  address?: CreateAddressDto;

  @ApiPropertyOptional({ type: () => CreateComplianceDocumentDto, isArray: true })
  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
