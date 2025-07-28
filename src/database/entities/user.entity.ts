import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Locker } from './locker.entity';
import { LockerLog } from './locker-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  rfid_uid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ default: 'student' })
  role: string; // 'student', 'teacher', 'admin'

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Locker, locker => locker.current_user)
  lockers: Locker[];

  @OneToMany(() => LockerLog, log => log.user)
  logs: LockerLog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}