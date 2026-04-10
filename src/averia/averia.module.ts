import { Module } from '@nestjs/common';
import { AveriaService } from './averia.service';
import { AveriaController } from './averia.controller';

@Module({
  controllers: [AveriaController],
  providers: [AveriaService],
})
export class AveriaModule {}
