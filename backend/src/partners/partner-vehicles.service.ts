import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { buildComplianceDocumentCreates } from './compliance-documents.mapper';
import { CreatePartnerVehicleDto } from './dto/create-partner-vehicle.dto';

@Injectable()
export class PartnerVehiclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
  ) {}

  buildCreateData(input: CreatePartnerVehicleDto) {
    return {
      publicId: this.publicIds.generatePartnerVehicleId(),
      plateNumber: input.plateNumber,
      make: input.make,
      model: input.model,
      capacityKg: input.capacityKg,
      ...(input.partnerShopId
        ? {
            partnerShop: {
              connect: {
                id: input.partnerShopId,
              },
            },
          }
        : {}),
      ...buildComplianceDocumentCreates(input.documents),
    } satisfies Prisma.PartnerVehicleCreateInput;
  }

  create(input: CreatePartnerVehicleDto) {
    return this.prisma.partnerVehicle.create({
      data: this.buildCreateData(input),
      include: { documents: true },
    });
  }

  list() {
    return this.prisma.partnerVehicle.findMany({
      include: { documents: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
