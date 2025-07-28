import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockersService } from './lockers.service';
import { LockersController } from './lockers.controller';
import { Locker } from '../database/entities/locker.entity';
import { LockerLog } from '../database/entities/locker-log.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Locker, LockerLog, User])],
  controllers: [LockersController],
  providers: [LockersService],
  exports: [LockersService],
})
export class LockersModule {}