import { Injectable } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildComplianceDocumentCreates } from './compliance-documents.mapper';
import { CreatePartnerShopDto } from './dto/create-partner-shop.dto';

@Injectable()
export class PartnerShopsService {
  constructor(private readonly prisma: PrismaService) {}

  buildCreateData(input: CreatePartnerShopDto) {
    return {
      name: input.name,
      code: input.code,
      contactName: input.contactName,
      phone: input.phone,
      hubId: input.hubId,
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
      include: { addresses: true, documents: true },
    });
  }

  list() {
    return this.prisma.partnerShop.findMany({
      include: { addresses: true, documents: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
