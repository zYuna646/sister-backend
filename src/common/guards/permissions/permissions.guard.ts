import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    console.log('requiredPermission', requiredPermission);

    // if (!requiredPermission) {
    //   return true;
    // }

    const request = context.switchToHttp().getRequest();

    const permissions = request.user.role.permissions;
    console.log('permissions', permissions);
    if (permissions.includes('*')) {
      return true;
    }

    const resource = context
      .getClass()
      .name.replace('Controller', '')
      .toUpperCase();
    const permission = `${requiredPermission} ${resource}`;

    console.log('permission', permission);
    return permissions.includes(permission);
  }
}
