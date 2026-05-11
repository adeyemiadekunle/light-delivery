import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUser } from '../current-user.type';

export const PUBLIC_ID_ACCESS_KEY = 'publicIdAccess';

export type PublicIdAccessKind = 'business' | 'hub' | 'driver';

type PublicIdAccessMetadata = {
  kind: PublicIdAccessKind;
  param: string;
};

type RequestWithScopedUser = {
  params?: Record<string, string>;
  user?: CurrentUser;
};

export const RequirePublicIdAccess = (kind: PublicIdAccessKind, param = 'publicId') =>
  SetMetadata(PUBLIC_ID_ACCESS_KEY, { kind, param } satisfies PublicIdAccessMetadata);

@Injectable()
export class ScopedPublicIdGuard implements CanActivate {
  private readonly privilegedRoles = new Set(['admin', 'ops', 'super_admin']);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const access = this.reflector.getAllAndOverride<PublicIdAccessMetadata>(PUBLIC_ID_ACCESS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!access) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithScopedUser>();
    const user = request.user;
    const targetPublicId = request.params?.[access.param];

    if (!user || !targetPublicId) {
      throw new ForbiddenException('Scoped access is required');
    }

    if (user.roles.some((role) => this.privilegedRoles.has(role))) {
      return true;
    }

    if (this.hasScopedAccess(user, access.kind, targetPublicId)) {
      return true;
    }

    throw new ForbiddenException('You do not have access to this resource');
  }

  private hasScopedAccess(user: CurrentUser, kind: PublicIdAccessKind, targetPublicId: string) {
    if (kind === 'business') {
      return user.businessPublicIds?.includes(targetPublicId) ?? false;
    }

    if (kind === 'hub') {
      return user.hubPublicIds?.includes(targetPublicId) ?? false;
    }

    return (
      user.driverPublicId === targetPublicId ||
      (user.driverPublicIds?.includes(targetPublicId) ?? false)
    );
  }
}
