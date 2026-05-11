import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: {
        roles: { include: { role: true } },
        merchantMemberships: {
          where: { isActive: true },
          include: { merchant: { select: { publicId: true } } },
        },
        hubAssignments: {
          where: { isActive: true },
          include: { hub: { select: { publicId: true } } },
        },
        driverAssignments: {
          where: { isActive: true },
          include: { driver: { select: { publicId: true } } },
        },
      },
    });

    if (!user || !(await this.passwordService.verify(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const roles = user.roles.map((entry) => entry.role.name);
    const businessPublicIds = user.merchantMemberships.map((entry) => entry.merchant.publicId);
    const hubPublicIds = user.hubAssignments.map((entry) => entry.hub.publicId);
    const driverPublicIds = user.driverAssignments.map((entry) => entry.driver.publicId);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      publicId: user.publicId,
      email: user.email,
      roles,
      businessPublicIds,
      hubPublicIds,
      driverPublicIds,
      driverPublicId: driverPublicIds[0],
    });

    return {
      accessToken,
      user: {
        publicId: user.publicId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
      },
    };
  }
}
