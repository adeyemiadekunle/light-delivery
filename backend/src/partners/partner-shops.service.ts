import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AddressType, PartnerStatus, Prisma } from '@prisma/client';
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

  buildCreateData(input: CreatePartnerShopDto, hub: PartnerShopHubCode) {
    return {
      publicId: this.publicIds.generatePartnerShopId(),
      name: input.name,
      contactName: input.contactName,
      phone: input.phone,
      status: PartnerStatus.PENDING,
      supportsDropoff: input.supportsDropoff,
      supportsPickup: input.supportsPickup,
      supportsReturns: input.supportsReturns,
      supportsPrintInShop: input.supportsPrintInShop,
      supportsDigitalReceipt: input.supportsDigitalReceipt,
      openingHours: input.openingHours as Prisma.InputJsonValue | undefined,
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

    return this.prisma.partnerShop.create({
      data: this.buildCreateData(input, hub),
      include: { addresses: true, documents: true, hub: true },
    });
  }

  async approve(publicId: string) {
    const partnerShop = await this.prisma.partnerShop.findUnique({
      where: { publicId },
      select: {
        id: true,
        publicId: true,
        code: true,
        status: true,
        hubId: true,
        hub: {
          select: {
            code: true,
          },
        },
      },
    });

    if (!partnerShop) {
      throw new NotFoundException('Partner shop was not found');
    }

    if (partnerShop.code || partnerShop.status === PartnerStatus.ACTIVE) {
      throw new ConflictException('Partner shop has already been approved');
    }

    if (!partnerShop.hubId || !partnerShop.hub) {
      throw new ConflictException('Partner shop must belong to a hub before approval');
    }

    const approvedPartnerShopCount = await this.prisma.partnerShop.count({
      where: {
        hubId: partnerShop.hubId,
        code: { not: null },
      },
    });

    return this.prisma.partnerShop.update({
      where: { id: partnerShop.id },
      data: {
        code: this.operationalCodes.generatePartnerShopCode(
          partnerShop.hub.code,
          approvedPartnerShopCount + 1,
        ),
        status: PartnerStatus.ACTIVE,
      },
    });
  }

  list() {
    return this.prisma.partnerShop.findMany({
      include: { addresses: true, documents: true, hub: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
