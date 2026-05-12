import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PartnerStatus, Prisma } from '@prisma/client';
import { OperationalCodeService } from '../common/ids/operational-code.service';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { buildComplianceDocumentCreates } from './compliance-documents.mapper';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
    private readonly operationalCodes: OperationalCodeService,
  ) {}

  buildCreateData(input: CreateDriverDto) {
    return {
      publicId: this.publicIds.generateDriverId(),
      fullName: input.fullName,
      phone: input.phone,
      status: PartnerStatus.PENDING,
      ...(input.userId
        ? {
            user: {
              connect: {
                id: input.userId,
              },
            },
          }
        : {}),
      ...buildComplianceDocumentCreates(input.documents),
    } satisfies Prisma.DriverCreateInput;
  }

  async approve(publicId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { publicId },
      select: {
        id: true,
        publicId: true,
        code: true,
        status: true,
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver was not found');
    }

    if (driver.code || driver.status === PartnerStatus.ACTIVE) {
      throw new ConflictException('Driver has already been approved');
    }

    const approvedDriverCount = await this.prisma.driver.count({
      where: {
        code: { not: null },
      },
    });

    return this.prisma.driver.update({
      where: { id: driver.id },
      data: {
        code: this.operationalCodes.generateDriverCode(approvedDriverCount + 1),
        status: PartnerStatus.ACTIVE,
      },
    });
  }

  create(input: CreateDriverDto) {
    return this.prisma.driver.create({
      data: this.buildCreateData(input),
      include: { documents: true },
    });
  }

  list() {
    return this.prisma.driver.findMany({
      include: { documents: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublicProfileByPublicId(publicId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { publicId },
      select: {
        publicId: true,
        code: true,
        fullName: true,
        phone: true,
        status: true,
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver was not found');
    }

    return driver;
  }
}
