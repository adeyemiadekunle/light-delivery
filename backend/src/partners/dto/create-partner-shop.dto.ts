import { IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';
import { CreateComplianceDocumentDto } from './create-compliance-document.dto';

export class CreatePartnerShopDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsString()
  contactName!: string;

  @IsString()
  phone!: string;

  @IsString()
  @IsOptional()
  hubId?: string;

  @IsOptional()
  address?: CreateAddressDto;

  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
