import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AveriasService } from './averias.service';
import { EstadoAveria, ValoracionAveria } from './averia.entity';

@Controller('api/averias')
export class AveriasController {
  constructor(private readonly averiasService: AveriasService) {}

  @Post()
  create(@Body() createAveriaDto: {
    nombre: string;
    tipo: string;
    ubicacion: string;
    descripcion: string;
  }) {
    return this.averiasService.create(createAveriaDto);
  }

  @Get()
  findAll() {
    return this.averiasService.findAll();
  }

  @Patch(':id/estado')
  updateEstado(
    @Param('id') id: string,
    @Body('estado') estado: EstadoAveria,
  ) {
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

  @Get('tecnicos')
  getTecnicos() {
    return this.averiasService.getTecnicos();
  }
}
