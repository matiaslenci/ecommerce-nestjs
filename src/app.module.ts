import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    /**
     * Configuracion de variables de entorno
     */
    ConfigModule.forRoot(),

    /**
     * Configuracion de TypeORM
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // Para  que cargue las entidades automaticamente
      synchronize: true, //En produccion debe ser false
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
