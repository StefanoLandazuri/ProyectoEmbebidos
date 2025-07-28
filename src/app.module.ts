import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { LockersModule } from './lockers/lockers.module';
import { RfidModule } from './rfid/rfid.module';
import { WebsocketModule } from './websocket/websocket.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3309,
      username: 'root',
      password: 'password',
      database: 'smart_lockers',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo
      logging: true,
    }),
    DatabaseModule,
    UsersModule,
    LockersModule,
    RfidModule,
    WebsocketModule,
  ],
})
export class AppModule {}