import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { User } from './user/entities/user.entity';
import { Averia } from './averia/entities/averia.entity';
import { AveriaModule } from './averia/averia.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'averias',
      entities: [User, Averia],
      synchronize: true, 
    }),
    AveriaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
