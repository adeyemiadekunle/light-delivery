import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUser } from './current-user.type';

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: CurrentUser) {
    const profile = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { roles: { include: { role: true } } },
    });

    if (!profile) {
      throw new NotFoundException('Authenticated user was not found');
    }

    return {
      publicId: profile.publicId,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      status: profile.status,
      roles: profile.roles.map((entry) => entry.role.name),
    };
  }
}
