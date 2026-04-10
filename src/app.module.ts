import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AveriaModule } from './averia/averia.module';

@Module({
  imports: [UserModule, AveriaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
