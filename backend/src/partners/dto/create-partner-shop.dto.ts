import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Can accept customer parcel drop-offs' })
  @IsBoolean()
  @IsOptional()
  supportsDropoff?: boolean;

  @ApiPropertyOptional({ description: 'Can hand parcels over to receivers for pickup' })
  @IsBoolean()
  @IsOptional()
  supportsPickup?: boolean;

  @ApiPropertyOptional({ description: 'Can accept return parcels' })
  @IsBoolean()
  @IsOptional()
  supportsReturns?: boolean;

  @ApiPropertyOptional({ description: 'Can print parcel labels or QR labels in shop' })
  @IsBoolean()
  @IsOptional()
  supportsPrintInShop?: boolean;

  @ApiPropertyOptional({ description: 'Can issue digital drop-off or pickup receipts' })
  @IsBoolean()
  @IsOptional()
  supportsDigitalReceipt?: boolean;

  @ApiPropertyOptional({
    description: 'Structured weekly opening hours keyed by day',
    example: { monday: { opens: '09:00', closes: '18:00' } },
  })
  @IsObject()
  @IsOptional()
  openingHours?: Record<string, unknown>;

  @ApiPropertyOptional({ type: () => CreateAddressDto })
  @IsOptional()
  address?: CreateAddressDto;

  @ApiPropertyOptional({ type: () => CreateComplianceDocumentDto, isArray: true })
  @IsOptional()
  documents?: CreateComplianceDocumentDto[];
}
