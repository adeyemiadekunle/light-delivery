import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  function contextFor(request: Record<string, unknown>) {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as never;
  }

  it('verifies bearer tokens and attaches the session user to the request', async () => {
    const jwt = {
      verifyAsync: jest.fn().mockResolvedValue({
        sub: 'user-internal-1',
        publicId: 'USR-TEST000000',
        roles: ['admin'],
      }),
    };
    const request = {
      headers: {
        authorization: 'Bearer access-token',
      },
    };
    const guard = new JwtAuthGuard(jwt as never);

    await expect(guard.canActivate(contextFor(request))).resolves.toBe(true);
    expect(jwt.verifyAsync).toHaveBeenCalledWith('access-token');
    expect(request).toMatchObject({
      user: {
        sub: 'user-internal-1',
        publicId: 'USR-TEST000000',
        roles: ['admin'],
      },
    });
  });

  it('rejects requests without a bearer token', async () => {
    const guard = new JwtAuthGuard({ verifyAsync: jest.fn() } as never);

    await expect(guard.canActivate(contextFor({ headers: {} }))).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
