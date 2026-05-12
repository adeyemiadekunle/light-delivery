import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { OperationalCodeService } from '../common/ids/operational-code.service';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHubDto } from './dto/create-hub.dto';

type HubLocationCode = {
  cityCode: string;
  localAreaCode: string;
};

@Injectable()
export class HubsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
    private readonly operationalCodes: OperationalCodeService,
  ) {}

  validateCreateInput(input: CreateHubDto) {
    if (!input.cityId) {
      throw new BadRequestException('cityId is required');
    }

    if (!input.localAreaId) {
      throw new BadRequestException('localAreaId is required');
    }
  }

  buildCreateData(input: CreateHubDto, location: HubLocationCode, sequence: number) {
    return {
      publicId: this.publicIds.generateHubId(),
      name: input.name,
      code: this.operationalCodes.generateHubCode(
        location.cityCode,
        location.localAreaCode,
        sequence,
      ),
      city: {
        connect: {
          id: input.cityId,
        },
      },
      localArea: {
        connect: {
          id: input.localAreaId,
        },
      },
      ...(input.address
        ? {
            addresses: {
              create: [
                {
                  type: AddressType.HUB,
                  line1: input.address,
                  postcode: input.postcode,
                  latitude: input.latitude,
                  longitude: input.longitude,
                },
              ],
            },
          }
        : {}),
    } satisfies Prisma.HubCreateInput;
  }

  async create(input: CreateHubDto) {
    this.validateCreateInput(input);

    const localArea = await this.prisma.localArea.findFirst({
      where: {
        id: input.localAreaId,
        cityId: input.cityId,
      },
      select: {
        code: true,
        city: {
          select: {
            code: true,
          },
        },
      },
    });

    if (!localArea) {
      throw new NotFoundException('Local area was not found for this city');
    }

    const existingHubCount = await this.prisma.hub.count({
      where: { localAreaId: input.localAreaId },
    });

    return this.prisma.hub.create({
      data: this.buildCreateData(
        input,
        {
          cityCode: localArea.city.code,
          localAreaCode: localArea.code,
        },
        existingHubCount + 1,
      ),
    });
  }

  async list() {
    return this.prisma.hub.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findPublicProfileByPublicId(publicId: string) {
    const hub = await this.prisma.hub.findUnique({
      where: { publicId },
      select: {
        publicId: true,
        name: true,
        code: true,
        cityId: true,
        localAreaId: true,
        isActive: true,
      },
    });

    if (!hub) {
      throw new NotFoundException('Hub was not found');
    }

    return hub;
  }
}
