import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { Usuario } from './usuarios/usuario.entity';
import { Averia } from './averias/averia.entity';
import { AveriasModule } from './averias/averias.module';

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
      entities: [Usuario, Averia],
      synchronize: true, // Auto-create tables based on entities for local dev
    }),
    AveriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
