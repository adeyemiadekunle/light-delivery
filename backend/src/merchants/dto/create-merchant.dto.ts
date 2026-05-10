import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

export class CreateMerchantDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsString()
  contactName!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  address?: CreateAddressDto;
}
