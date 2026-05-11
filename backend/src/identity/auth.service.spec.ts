import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const user = {
    id: 'user-internal-1',
    publicId: 'USR-TEST000000',
    email: 'amina@example.com',
    passwordHash: 'hash',
    firstName: 'Amina',
    lastName: 'Bello',
    roles: [{ role: { name: 'admin' } }, { role: { name: 'ops' } }],
  };

  it('signs the access token with public identity context and hides internal id from response', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(user),
      },
    };
    const jwt = {
      signAsync: jest.fn().mockResolvedValue('access-token'),
    };
    const passwords = {
      verify: jest.fn().mockResolvedValue(true),
    };
    const service = new AuthService(prisma as never, jwt as never, passwords as never);

    const result = await service.login({
      email: 'amina@example.com',
      password: 'strong-password',
    });

    expect(jwt.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: 'user-internal-1',
        publicId: 'USR-TEST000000',
        email: 'amina@example.com',
        roles: ['admin', 'ops'],
      }),
    );
    expect(result).toEqual({
      accessToken: 'access-token',
      user: {
        publicId: 'USR-TEST000000',
        email: 'amina@example.com',
        firstName: 'Amina',
        lastName: 'Bello',
        roles: ['admin', 'ops'],
      },
    });
  });

  it('rejects invalid credentials', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(user),
      },
    };
    const jwt = {
      signAsync: jest.fn(),
    };
    const passwords = {
      verify: jest.fn().mockResolvedValue(false),
    };
    const service = new AuthService(prisma as never, jwt as never, passwords as never);

    await expect(
      service.login({
        email: 'amina@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
