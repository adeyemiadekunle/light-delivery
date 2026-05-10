import { Injectable } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PublicIdService } from '../common/ids/public-id.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publicIds: PublicIdService,
  ) {}

  buildCreateData(input: CreateCustomerDto) {
    return {
      publicId: this.publicIds.generateCustomerId(),
      userId: input.userId,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      ...(input.address
        ? {
            addresses: {
              create: [
                {
                  type: AddressType.CUSTOMER,
                  ...input.address,
                },
              ],
            },
          }
        : {}),
    } satisfies Prisma.CustomerCreateInput;
  }

  create(input: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: this.buildCreateData(input),
      include: { addresses: true },
    });
  }

  list() {
    return this.prisma.customer.findMany({
      include: { addresses: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
