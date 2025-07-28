import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Locker } from './entities/locker.entity';
import { LockerLog } from './entities/locker-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Locker, LockerLog])
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}