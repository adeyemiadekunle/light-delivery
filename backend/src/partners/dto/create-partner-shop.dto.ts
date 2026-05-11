import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';
import { CreateComplianceDocumentDto } from './create-compliance-document.dto';

export class CreatePartnerShopDto {
  @ApiProperty({ example: 'Ikeja Pickup Partner' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'PS-IKJ-001' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Amina Bello' })
  @IsString()
  contactName!: string;

  @ApiProperty({ example: '08030000000' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ description: 'Internal hub id this partner shop serves' })
  @IsString()
  @IsOptional()
  hubId?: string;

  @ApiPropertyOptional({ type: () => CreateAddressDto })
  @IsOptional()
  address?: CreateAddressDto;

  @ApiPropertyOptional({ type: () => CreateComplianceDocumentDto, isArray: true })
  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
