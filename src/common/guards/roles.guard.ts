import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtUtils } from '../utility/jwtUtils';

/**
 * RolesGuard is a custom NestJS guard for role-based access control (RBAC).
 * It checks if the current request has the required roles based on the JWT token.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current request meets the role-based access control requirements.
   *
   * @param context - The execution context for the current request.
   * This provides access to the request object and metadata.
   *
   * @returns boolean - Returns `true` if the request should proceed, `false` otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles required for the route handler from metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Extract the request object from the execution context
    const { headers } = context.switchToHttp().getRequest();

    // Decode the JWT token from the headers
    const decoded_token = JwtUtils.decodeToken(headers['x-access-token']);

    // Check if the decoded token roles match any of the required roles
    return requiredRoles.some((role) => decoded_token?.role === role);
  }
}
