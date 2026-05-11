import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustodyEventType } from '@prisma/client';
import { IsEnum, IsISO8601, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustodyEventDto {
  @ApiProperty({ description: 'Internal parcel id receiving the custody event' })
  @IsString()
  @IsNotEmpty()
  parcelId!: string;

  @ApiProperty({ enum: CustodyEventType, example: CustodyEventType.HUB_RECEIVED })
  @IsEnum(CustodyEventType)
  eventType!: CustodyEventType;

  @ApiPropertyOptional({ description: 'Internal actor id recording the event' })
  @IsString()
  @IsOptional()
  actorId?: string;

  @ApiPropertyOptional({ description: 'Internal hub id where the event occurred' })
  @IsString()
  @IsOptional()
  hubId?: string;

  @ApiPropertyOptional({ description: 'Internal manifest id when event is tied to a manifest' })
  @IsString()
  @IsOptional()
  manifestId?: string;

  @ApiPropertyOptional({ example: 'Parcel received at origin hub' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: Object, additionalProperties: true })
  @IsObject()
  @IsOptional()
  evidence?: Record<string, unknown>;

  @ApiProperty({ format: 'date-time', example: '2026-05-11T10:00:00.000Z' })
  @IsISO8601()
  occurredAt!: string;
}
