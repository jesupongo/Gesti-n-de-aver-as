import { Module } from '@nestjs/common';
import { AveriaService } from './averia.service';
import { AveriaController } from './averia.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Averia } from './entities/averia.entity';

@Module({
  controllers: [AveriaController],
  providers: [AveriaService],
  imports: [UserModule, TypeOrmModule.forFeature([Averia])]
})
export class AveriaModule {}
