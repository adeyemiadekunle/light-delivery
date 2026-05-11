import { NotFoundException } from '@nestjs/common';
import { MeService } from './me.service';

describe('MeService', () => {
  it('returns the authenticated user public profile with roles', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          publicId: 'USR-TEST000000',
          email: 'amina@example.com',
          firstName: 'Amina',
          lastName: 'Bello',
          status: 'ACTIVE',
          roles: [{ role: { name: 'admin' } }],
        }),
      },
    };
    const service = new MeService(prisma as never);

    await expect(service.getProfile({ sub: 'user-internal-1' } as never)).resolves.toEqual({
      publicId: 'USR-TEST000000',
      email: 'amina@example.com',
      firstName: 'Amina',
      lastName: 'Bello',
      status: 'ACTIVE',
      roles: ['admin'],
    });
  });

  it('throws when the authenticated user no longer exists', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    const service = new MeService(prisma as never);

    await expect(service.getProfile({ sub: 'missing-user' } as never)).rejects.toThrow(
      NotFoundException,
    );
  });
});
