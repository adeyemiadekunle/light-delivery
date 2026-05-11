import { IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';
import { CreateComplianceDocumentDto } from './create-compliance-document.dto';

export class CreateDriverDto {
  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsOptional()
  address?: CreateAddressDto;

  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
