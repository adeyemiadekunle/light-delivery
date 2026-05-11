import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Amina Bello' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '08030000000' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ example: 'amina@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Internal user id when this customer is linked to a login' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ type: () => CreateAddressDto })
  @IsOptional()
  address?: CreateAddressDto;
}
