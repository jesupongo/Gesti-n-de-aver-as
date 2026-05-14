import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EstadoAveria } from '../enums/estados.enum';
import { ValoracionAveria } from '../enums/valoracion.enum';

export class CreateAveriaDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsEnum(ValoracionAveria)
  @IsOptional()
  valoracion?: ValoracionAveria;

  @IsEnum(EstadoAveria)
  @IsOptional()
  estado?: EstadoAveria;

  @IsDateString()
  fecha_comunica: Date;

  @IsString()
  ubicacion: string;

  @IsString()
  descripcion: string;

  @IsUUID()
  @IsOptional()
  reportadorId?: string;
}
