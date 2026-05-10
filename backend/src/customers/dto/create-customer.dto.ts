import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

export class CreateCustomerDto {
  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsOptional()
  address?: CreateAddressDto;
}
