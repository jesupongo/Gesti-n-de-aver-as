import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { RolUsuario } from '../enum/rol.enum';

export class CreateUserDto {
  @IsString()
  nombre: string;

  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsEnum(RolUsuario, {
    message: 'El rol debe ser ADMINISTRADOR, MANTENIMIENTO o PERSONAL',
  })
  @IsOptional()
  rol?: RolUsuario;

  @IsString()
  @IsOptional()
  oficio?: string;

  @IsString()
  @IsOptional()
  especialidad?: string;
}
