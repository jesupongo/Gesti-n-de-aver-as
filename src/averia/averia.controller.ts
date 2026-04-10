import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AveriaService } from './averia.service';
import { CreateAveriaDto } from './dto/create-averia.dto';
import { UpdateAveriaDto } from './dto/update-averia.dto';

@Controller('averia')
export class AveriaController {
  constructor(private readonly averiaService: AveriaService) {}

  @Post()
  create(@Body() createAveriaDto: CreateAveriaDto) {
    return this.averiaService.create(createAveriaDto);
  }

  @Get()
  findAll() {
    return this.averiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.averiaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAveriaDto: UpdateAveriaDto) {
    return this.averiaService.update(+id, updateAveriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.averiaService.remove(+id);
  }
}
