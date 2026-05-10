import { IsOptional, IsString } from 'class-validator';
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
  documents?: CreateComplianceDocumentDto[];
}
