import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  buildLookupKey(actorId: string, scope: string, key: string) {
    return `${actorId}:${scope}:${key}`;
  }
}
