import { Injectable } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { buildComplianceDocumentCreates } from './compliance-documents.mapper';
import { CreatePartnerShopDto } from './dto/create-partner-shop.dto';

@Injectable()
export class PartnerShopsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
  ) {}

  buildCreateData(input: CreatePartnerShopDto) {
    return {
      publicId: this.publicIds.generatePartnerShopId(),
      name: input.name,
      code: input.code,
      contactName: input.contactName,
      phone: input.phone,
      ...(input.hubId
        ? {
            hub: {
              connect: {
                id: input.hubId,
              },
            },
          }
        : {}),
      ...(input.address
        ? {
            addresses: {
              create: [
                {
                  type: AddressType.PARTNER_SHOP,
                  ...input.address,
                },
              ],
            },
          }
        : {}),
      ...buildComplianceDocumentCreates(input.documents),
    } satisfies Prisma.PartnerShopCreateInput;
  }

  create(input: CreatePartnerShopDto) {
    return this.prisma.partnerShop.create({
      data: this.buildCreateData(input),
      include: { addresses: true, documents: true, hub: true },
    });
  }

  list() {
    return this.prisma.partnerShop.findMany({
      include: { addresses: true, documents: true, hub: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
