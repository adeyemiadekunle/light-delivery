import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { TrackingCodeService } from './tracking-code.service';
import { WaybillService } from './waybill.service';

@Injectable()
export class ParcelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
    private readonly waybillService: WaybillService,
    private readonly trackingCodes: TrackingCodeService,
  ) {}

  validateCreateInput(input: Partial<CreateParcelDto>) {
    if (!input.senderName) {
      throw new BadRequestException('senderName is required for returns');
    }

    if (!input.senderPhone) {
      throw new BadRequestException('senderPhone is required for returns');
    }

    if (!input.senderAddress) {
      throw new BadRequestException('senderAddress is required for returns');
    }
  }

  buildParcelAddressSnapshots(input: CreateParcelDto) {
    return {
      senderAddress: {
        create: {
          type: AddressType.PARCEL_SENDER,
          contactName: input.senderName,
          contactPhone: input.senderPhone,
          line1: input.senderAddress,
          postcode: input.senderPostcode,
          latitude: input.senderLatitude,
          longitude: input.senderLongitude,
        },
      },
      ...(input.receiverAddress
        ? {
            receiverAddress: {
              create: {
                type: AddressType.PARCEL_RECEIVER,
                contactName: input.receiverName,
                contactPhone: input.receiverPhone,
                line1: input.receiverAddress,
                postcode: input.receiverPostcode,
                latitude: input.receiverLatitude,
                longitude: input.receiverLongitude,
              },
            },
          }
        : {}),
    } satisfies Pick<Prisma.ParcelCreateInput, 'senderAddress' | 'receiverAddress'>;
  }

  async create(input: CreateParcelDto) {
    this.validateCreateInput(input);

    const quote = this.pricingService.quote({ weightKg: input.weightKg });

    return this.prisma.parcel.create({
      data: {
        waybillNumber: this.waybillService.generate('LOS'),
        trackingCode: this.trackingCodes.generate(),
        serviceType: input.serviceType,
        senderCustomerId: input.senderCustomerId,
        merchantId: input.merchantId,
        originHubId: input.originHubId,
        destinationHubId: input.destinationHubId,
        senderName: input.senderName,
        senderPhone: input.senderPhone,
        receiverName: input.receiverName,
        receiverPhone: input.receiverPhone,
        ...this.buildParcelAddressSnapshots(input),
        weightKg: input.weightKg,
        price: quote.amount,
      },
    });
  }

  async findByTrackingCode(code: string) {
    return this.prisma.parcel.findUnique({
      where: { trackingCode: code },
      include: {
        custodyEvents: {
          orderBy: { occurredAt: 'asc' },
        },
      },
    });
  }
}
