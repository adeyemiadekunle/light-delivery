import { Injectable } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
  ) {}

  buildCreateData(input: CreateMerchantDto) {
    return {
      publicId: this.publicIds.generateBusinessId(),
      name: input.name,
      code: input.code,
      contactName: input.contactName,
      phone: input.phone,
      email: input.email,
      ...(input.address
        ? {
            addresses: {
              create: [
                {
                  type: AddressType.MERCHANT,
                  ...input.address,
                },
              ],
            },
          }
        : {}),
    } satisfies Prisma.MerchantCreateInput;
  }

  create(input: CreateMerchantDto) {
    return this.prisma.merchant.create({
      data: this.buildCreateData(input),
      include: { addresses: true },
    });
  }

  list() {
    return this.prisma.merchant.findMany({
      include: { addresses: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
