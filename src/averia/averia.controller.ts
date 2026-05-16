import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { AveriaService } from './averia.service';
import { EstadoAveria } from './enums/estados.enum';
import { ValoracionAveria } from './enums/valoracion.enum';

@Controller('averia')
export class AveriaController {
  constructor(private readonly averiasService: AveriaService) {}

  @Post()
  create(
    @Body()
    createAveriaDto: {
      nombre: string;
      tipo: string;
      ubicacion: string;
      descripcion: string;
      reportadorId?: number;
    },
  ) {
    return this.averiasService.create(createAveriaDto);
  }

  @Get()
  findAll() {
    return this.averiasService.findAll();
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body('estado') estado: EstadoAveria) {
    return this.averiasService.updateEstado(+id, estado);
  }

  @Patch(':id/prioridad')
  updatePrioridad(
    @Param('id') id: string,
    @Body('prioridad') prioridad: ValoracionAveria,
  ) {
    return this.averiasService.updatePrioridad(+id, prioridad);
  }

  @Patch(':id/tecnico')
  asignarTecnico(
    @Param('id') id: string,
    @Body('tecnicoId') tecnicoId: number,
  ) {
    return this.averiasService.asignarTecnico(+id, tecnicoId);
  }

  @Patch(':id/verificar')
  verificar(@Param('id') id: string) {
    return this.averiasService.verificar(+id);
  }

  @Get('tecnicos')
  getTecnicos() {
    return this.averiasService.getTecnicos();
  }
}
