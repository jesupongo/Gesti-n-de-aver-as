import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoAveria } from '../enums/estados.enum';
import { ValoracionAveria } from '../enums/valoracion.enum';

export class CreateAveriaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsEnum(ValoracionAveria)
  @IsOptional()
  valoracion?: ValoracionAveria;

  @IsEnum(EstadoAveria)
  @IsOptional()
  estado?: EstadoAveria;

  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  reportadorId?: any;
}
