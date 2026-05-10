import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHubDto } from './dto/create-hub.dto';

@Injectable()
export class HubsService {
  constructor(private readonly prisma: PrismaService) {}

  validateCreateInput(input: CreateHubDto) {
    if (!input.cityId) {
      throw new BadRequestException('cityId is required');
    }

  }

  buildCreateData(input: CreateHubDto) {
    return {
      name: input.name,
      code: input.code,
      city: {
        connect: {
          id: input.cityId,
        },
      },
      ...(input.localAreaId
        ? {
            localArea: {
              connect: {
                id: input.localAreaId,
              },
            },
          }
        : {}),
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
}
