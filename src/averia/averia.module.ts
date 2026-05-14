import { forwardRef, Module } from '@nestjs/common';
import { AveriaService } from './averia.service';
import { AveriaController } from './averia.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Averia } from './entities/averia.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [AveriaController],
  providers: [AveriaService],
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Averia, User])],
  exports: [AveriaService]
})
export class AveriaModule {}
