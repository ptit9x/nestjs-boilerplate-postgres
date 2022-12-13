import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { PERMISSION_METADATA } from 'src/share/common/app.const';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>(
      PERMISSION_METADATA,
      context.getHandler(),
    );

    const { user } = context.switchToHttp().getRequest();
    const userPermissions = user?.permissions || [];
    if (user?.isAdministrator) return true;

    const hasPermission = () =>
      routePermissions?.some((routePermission) =>
        userPermissions.includes(routePermission),
      );

    return hasPermission();
  }
}
