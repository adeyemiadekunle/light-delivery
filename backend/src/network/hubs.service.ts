import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHubDto } from './dto/create-hub.dto';

@Injectable()
export class HubsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
  ) {}

  validateCreateInput(input: CreateHubDto) {
    if (!input.cityId) {
      throw new BadRequestException('cityId is required');
    }

    if (!input.localAreaId) {
      throw new BadRequestException('localAreaId is required');
    }
  }

  buildCreateData(input: CreateHubDto) {
    return {
      publicId: this.publicIds.generateHubId(),
      name: input.name,
      code: input.code,
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

    return this.prisma.hub.create({
      data: this.buildCreateData(input),
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
