import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { OperationalCodeService } from '../common/ids/operational-code.service';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { buildComplianceDocumentCreates } from './compliance-documents.mapper';
import { CreatePartnerShopDto } from './dto/create-partner-shop.dto';

type PartnerShopHubCode = {
  id: string;
  code: string;
};

@Injectable()
export class PartnerShopsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
    private readonly operationalCodes: OperationalCodeService,
  ) {}

  buildCreateData(input: CreatePartnerShopDto, hub: PartnerShopHubCode, sequence: number) {
    return {
      publicId: this.publicIds.generatePartnerShopId(),
      name: input.name,
      code: this.operationalCodes.generatePartnerShopCode(hub.code, sequence),
      contactName: input.contactName,
      phone: input.phone,
      hub: {
        connect: {
          id: hub.id,
        },
      },
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

  async create(input: CreatePartnerShopDto) {
    const hub = await this.prisma.hub.findUnique({
      where: { publicId: input.hubPublicId },
      select: { id: true, code: true },
    });

    if (!hub) {
      throw new NotFoundException('Hub was not found');
    }

    const existingPartnerShopCount = await this.prisma.partnerShop.count({
      where: { hubId: hub.id },
    });

    return this.prisma.partnerShop.create({
      data: this.buildCreateData(input, hub, existingPartnerShopCount + 1),
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
