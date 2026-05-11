import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { buildComplianceDocumentCreates } from './compliance-documents.mapper';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
  ) {}

  buildCreateData(input: CreateDriverDto) {
    return {
      publicId: this.publicIds.generateDriverId(),
      fullName: input.fullName,
      phone: input.phone,
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
