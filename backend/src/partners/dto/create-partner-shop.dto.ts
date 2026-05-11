import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';
import { CreateComplianceDocumentDto } from './create-compliance-document.dto';

export class CreatePartnerShopDto {
  @ApiProperty({ example: 'Ikeja Pickup Partner' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Amina Bello' })
  @IsString()
  contactName!: string;

  @ApiProperty({ example: '08030000000' })
  @IsString()
  phone!: string;

  @ApiProperty({ description: 'Public id of the controlling hub this partner shop serves' })
  @IsString()
  hubPublicId!: string;

  @ApiPropertyOptional({ type: () => CreateAddressDto })
  @IsOptional()
  address?: CreateAddressDto;

  @ApiPropertyOptional({ type: () => CreateComplianceDocumentDto, isArray: true })
  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
