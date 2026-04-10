import { Injectable } from '@nestjs/common';
import { CreateAveriaDto } from './dto/create-averia.dto';
import { UpdateAveriaDto } from './dto/update-averia.dto';

@Injectable()
export class AveriaService {
  create(createAveriaDto: CreateAveriaDto) {
    return 'This action adds a new averia';
  }

  findAll() {
    return `This action returns all averia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} averia`;
  }

  update(id: number, updateAveriaDto: UpdateAveriaDto) {
    return `This action updates a #${id} averia`;
  }

  remove(id: number) {
    return `This action removes a #${id} averia`;
  }
}
