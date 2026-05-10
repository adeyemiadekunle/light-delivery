import { CustodyEventType } from '@prisma/client';
import { IsEnum, IsISO8601, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustodyEventDto {
  @IsString()
  @IsNotEmpty()
  parcelId!: string;

  @IsEnum(CustodyEventType)
  eventType!: CustodyEventType;

  @IsString()
  @IsOptional()
  actorId?: string;

  @IsString()
  @IsOptional()
  hubId?: string;

  @IsString()
  @IsOptional()
  manifestId?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  evidence?: Record<string, unknown>;

  @IsISO8601()
  occurredAt!: string;
}
