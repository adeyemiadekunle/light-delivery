import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

export class CreateMerchantDto {
  @ApiProperty({ example: 'Light Foods Limited' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'LIGHT-FOODS' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Tunde Ade' })
  @IsString()
  contactName!: string;

  @ApiProperty({ example: '08031111111' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ example: 'ops@lightfoods.example' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ type: () => CreateAddressDto })
  @IsOptional()
  address?: CreateAddressDto;
}
