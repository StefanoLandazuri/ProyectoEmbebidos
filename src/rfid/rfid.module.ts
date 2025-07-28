import { Module } from '@nestjs/common';
import { RfidService } from './rfid.service';
import { RfidController } from './rfid.controller';
import { UsersModule } from '../users/users.module';
import { LockersModule } from '../lockers/lockers.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [UsersModule, LockersModule, WebsocketModule],
  controllers: [RfidController],
  providers: [RfidService],
  exports: [RfidService],
})
export class RfidModule {}