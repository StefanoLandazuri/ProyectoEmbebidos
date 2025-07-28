import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Locker } from './locker.entity';

export enum LogAction {
  ASSIGN = 'assign',
  RELEASE = 'release',
  WEIGHT_CHANGE = 'weight_change',
  EMERGENCY_OPEN = 'emergency_open',
  ADMIN_RELEASE = 'admin_release'
}

@Entity('locker_logs')
export class LockerLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Locker, locker => locker.logs)
  locker: Locker;

  @ManyToOne(() => User, user => user.logs, { nullable: true })
  user: User;

  @Column({
    type: 'enum',
    enum: LogAction
  })
  action: LogAction;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight_before: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight_after: number;

  @Column({ nullable: true })
  rfid_uid: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;
}