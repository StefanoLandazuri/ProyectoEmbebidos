import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { LockerLog } from './locker-log.entity';

export enum LockerStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved'
}

@Entity('lockers')
export class Locker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  locker_number: string; // L-01, L-02, etc.

  @Column({
    type: 'enum',
    enum: LockerStatus,
    default: LockerStatus.AVAILABLE
  })
  status: LockerStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  current_weight: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 50 })
  weight_threshold: number;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  is_locked: boolean;

  @Column({ nullable: true })
  last_rfid_scan: string;

  @Column({ nullable: true })
  assigned_at: Date;

  @ManyToOne(() => User, user => user.lockers, { nullable: true })
  current_user: User;

  @OneToMany(() => LockerLog, log => log.locker)
  logs: LockerLog[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
