import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildComplianceDocumentCreates } from './compliance-documents.mapper';
import { CreateDriverDto } from './dto/create-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  buildCreateData(input: CreateDriverDto) {
    return {
      fullName: input.fullName,
      phone: input.phone,
      userId: input.userId,
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
}
