import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Averia } from './averia.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { AveriasController } from './averias.controller';
import { AveriasService } from './averias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Averia, Usuario])],
  controllers: [AveriasController],
  providers: [AveriasService],
})
export class AveriasModule {}
