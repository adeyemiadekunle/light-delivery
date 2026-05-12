import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AddressType, BusinessStatus, Prisma } from '@prisma/client';
import { OperationalCodeService } from '../common/ids/operational-code.service';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
    private readonly operationalCodes: OperationalCodeService,
  ) {}

  buildCreateData(input: CreateMerchantDto) {
    return {
      publicId: this.publicIds.generateBusinessId(),
      name: input.name,
      contactName: input.contactName,
      phone: input.phone,
      email: input.email,
      status: BusinessStatus.PENDING,
      isActive: false,
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

  async approve(publicId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { publicId },
      select: {
        id: true,
        publicId: true,
        name: true,
        code: true,
        status: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Business was not found');
    }

    if (merchant.code || merchant.status === BusinessStatus.ACTIVE) {
      throw new ConflictException('Business has already been approved');
    }

    const approvedMerchantCount = await this.prisma.merchant.count({
      where: {
        code: { not: null },
      },
    });

    return this.prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        code: this.operationalCodes.generateBusinessCode(merchant.name, approvedMerchantCount + 1),
        status: BusinessStatus.ACTIVE,
        isActive: true,
      },
    });
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

  async findPublicProfileByPublicId(publicId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { publicId },
      select: {
        publicId: true,
        name: true,
        code: true,
        contactName: true,
        phone: true,
        email: true,
        status: true,
        isActive: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Business was not found');
    }

    return merchant;
  }
}
