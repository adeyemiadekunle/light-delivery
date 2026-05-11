import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PublicIdAccessKind, ScopedPublicIdGuard } from './scoped-public-id.guard';

describe('ScopedPublicIdGuard', () => {
  function buildGuard(kind: PublicIdAccessKind) {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue({ kind, param: 'publicId' }),
    } as unknown as Reflector;

    return new ScopedPublicIdGuard(reflector);
  }

  function contextFor(request: Record<string, unknown>) {
    return {
      getHandler: () => 'handler',
      getClass: () => 'class',
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;
  }

  it('allows admins to access any scoped public id', () => {
    const guard = buildGuard('business');

    expect(
      guard.canActivate(
        contextFor({
          params: { publicId: 'BUS-OTHER' },
          user: { roles: ['admin'], businessPublicIds: [] },
        }),
      ),
    ).toBe(true);
  });

  it('allows assigned business access by public id', () => {
    const guard = buildGuard('business');

    expect(
      guard.canActivate(
        contextFor({
          params: { publicId: 'BUS-TEST000000' },
          user: { roles: ['merchant'], businessPublicIds: ['BUS-TEST000000'] },
        }),
      ),
    ).toBe(true);
  });

  it('denies unassigned business access', () => {
    const guard = buildGuard('business');

    expect(() =>
      guard.canActivate(
        contextFor({
          params: { publicId: 'BUS-OTHER' },
          user: { roles: ['merchant'], businessPublicIds: ['BUS-TEST000000'] },
        }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('allows assigned hub access by public id', () => {
    const guard = buildGuard('hub');

    expect(
      guard.canActivate(
        contextFor({
          params: { publicId: 'HUB-TEST000000' },
          user: { roles: ['hub_staff'], hubPublicIds: ['HUB-TEST000000'] },
        }),
      ),
    ).toBe(true);
  });

  it('allows driver self access by public id', () => {
    const guard = buildGuard('driver');

    expect(
      guard.canActivate(
        contextFor({
          params: { publicId: 'DRV-TEST000000' },
          user: { roles: ['driver'], driverPublicId: 'DRV-TEST000000' },
        }),
      ),
    ).toBe(true);
  });
});
