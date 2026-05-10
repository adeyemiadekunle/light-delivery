import { BadRequestException, Injectable } from '@nestjs/common';
import { ParcelStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustodyEventDto } from './dto/create-custody-event.dto';

@Injectable()
export class CustodyService {
  constructor(private readonly prisma: PrismaService) {}

  validateScan(input: Partial<CreateCustodyEventDto>) {
    if (!input.parcelId) {
      throw new BadRequestException('parcelId is required');
    }

    if (!input.eventType) {
      throw new BadRequestException('eventType is required');
    }
  }

  async record(input: CreateCustodyEventDto) {
    this.validateScan(input);

    return this.prisma.$transaction(async (tx) => {
      const event = await tx.custodyEvent.create({
        data: {
          parcelId: input.parcelId,
          actorId: input.actorId,
          hubId: input.hubId,
          manifestId: input.manifestId,
          eventType: input.eventType,
          notes: input.notes,
          evidence: input.evidence as Prisma.InputJsonValue | undefined,
          occurredAt: new Date(input.occurredAt),
        },
      });

      await tx.parcel.update({
        where: { id: input.parcelId },
        data: { status: this.statusForEvent(input.eventType) },
      });

      return event;
    });
  }

  private statusForEvent(eventType: CreateCustodyEventDto['eventType']) {
    const statusByEvent: Partial<Record<CreateCustodyEventDto['eventType'], ParcelStatus>> = {
      HUB_RECEIVED: ParcelStatus.RECEIVED_AT_ORIGIN_HUB,
      MANIFEST_ADDED: ParcelStatus.IN_MANIFEST,
      MANIFEST_DEPARTED: ParcelStatus.IN_TRANSIT,
      MANIFEST_ARRIVED: ParcelStatus.ARRIVED_AT_DESTINATION_HUB,
      OUT_FOR_DELIVERY: ParcelStatus.OUT_FOR_DELIVERY,
      PICKUP_COMPLETED: ParcelStatus.DELIVERED,
      DELIVERY_COMPLETED: ParcelStatus.DELIVERED,
      RETURN_TO_HUB: ParcelStatus.FAILED_DELIVERY,
      RETURN_TO_SENDER: ParcelStatus.RETURNED,
      EXCEPTION_RECORDED: ParcelStatus.EXCEPTION,
    };

    return statusByEvent[eventType] ?? ParcelStatus.BOOKED;
  }
}
