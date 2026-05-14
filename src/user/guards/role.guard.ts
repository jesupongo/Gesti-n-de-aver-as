import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../enum/rol.enum';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles definidos en el decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles definidos, la ruta es pública o no requiere rol específico
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener el usuario de la petición (inyectado previamente por el AuthGuard del JWT)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('No se encontró usuario en la petición');
    }

    // 3. Verificar si el rol del usuario coincide con alguno de los permitidos
    const hasRole = requiredRoles.some((role) => user.rol === role);

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return true;
  }
}
