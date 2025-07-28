import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locker, LockerStatus } from '../database/entities/locker.entity';
import { LockerLog, LogAction } from '../database/entities/locker-log.entity';
import { User } from '../database/entities/user.entity';
import { CreateLockerDto } from './dto/create-locker.dto';
import { UpdateLockerDto } from './dto/update-locker.dto';

@Injectable()
export class LockersService {
  constructor(
    @InjectRepository(Locker)
    private lockerRepository: Repository<Locker>,
    @InjectRepository(LockerLog)
    private logRepository: Repository<LockerLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createLockerDto: CreateLockerDto): Promise<Locker> {
    const locker = this.lockerRepository.create(createLockerDto);
    return await this.lockerRepository.save(locker);
  }

  async findAll(): Promise<Locker[]> {
    return await this.lockerRepository.find({
      relations: ['current_user'],
      order: { locker_number: 'ASC' }
    });
  }

  async findById(id: number): Promise<Locker> {
    const locker = await this.lockerRepository.findOne({
      where: { id },
      relations: ['current_user', 'logs']
    });
    if (!locker) {
      throw new NotFoundException(`Locker con ID ${id} no encontrado`);
    }
    return locker;
  }

  async findAvailableLocker(): Promise<Locker | null> {
    return await this.lockerRepository.findOne({
      where: { status: LockerStatus.AVAILABLE },
      order: { locker_number: 'ASC' }
    });
  }

  async assignLocker(userId: number, lockerId?: number): Promise<Locker> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el usuario ya tiene un locker asignado
    const existingLocker = await this.lockerRepository.findOne({
      where: { current_user: { id: userId } }
    });
    if (existingLocker) {
      throw new BadRequestException('El usuario ya tiene un locker asignado');
    }

    let locker: Locker;
    if (lockerId) {
      locker = await this.findById(lockerId);
      if (locker.status !== LockerStatus.AVAILABLE) {
        throw new BadRequestException('El locker no está disponible');
      }
    } else {
      const availableLocker = await this.findAvailableLocker();
      if (!availableLocker) {
        throw new BadRequestException('No hay lockers disponibles');
      }
      locker = availableLocker;
    }

    locker.current_user = user;
    locker.status = LockerStatus.RESERVED;
    locker.assigned_at = new Date();
    locker.last_rfid_scan = user.rfid_uid;

    await this.lockerRepository.save(locker);

    // Crear log
    await this.createLog(locker, user, LogAction.ASSIGN, { rfid_uid: user.rfid_uid });

    return locker;
  }

  async releaseLocker(lockerId: number, adminRelease: boolean = false): Promise<Locker> {
    const locker = await this.findById(lockerId);
    
    if (!locker.current_user) {
      throw new BadRequestException('El locker no está asignado');
    }

    const user = locker.current_user;
    locker.current_user = undefined;
    locker.status = LockerStatus.AVAILABLE;
    locker.assigned_at = null;
    locker.is_locked = false;
    locker.current_weight = 0;

    await this.lockerRepository.save(locker);

    // Crear log
    const action = adminRelease ? LogAction.ADMIN_RELEASE : LogAction.RELEASE;
    await this.createLog(locker, user, action);

    return locker;
  }

  async updateWeight(lockerId: number, weight: number): Promise<Locker> {
    const locker = await this.findById(lockerId);
    const oldWeight = locker.current_weight;
    
    locker.current_weight = weight;
    
    // Determinar si está ocupado basado en el peso
    if (weight > locker.weight_threshold) {
      if (locker.status === LockerStatus.RESERVED) {
        locker.status = LockerStatus.OCCUPIED;
        locker.is_locked = true;
      }
    } else {
      if (locker.status === LockerStatus.OCCUPIED && locker.current_user) {
        locker.status = LockerStatus.RESERVED;
        locker.is_locked = false;
      }
    }

    await this.lockerRepository.save(locker);

    // Crear log solo si hay cambio significativo de peso (>10g)
    if (Math.abs(weight - oldWeight) > 10) {
      await this.createLog(
        locker, 
        locker.current_user, 
        LogAction.WEIGHT_CHANGE,
        { weight_before: oldWeight, weight_after: weight }
      );
    }

    return locker;
  }

  async emergencyOpen(lockerId: number): Promise<Locker> {
    const locker = await this.findById(lockerId);
    
    locker.is_locked = false;
    await this.lockerRepository.save(locker);

    await this.createLog(locker, locker.current_user, LogAction.EMERGENCY_OPEN);

    return locker;
  }

  async getLockerStats() {
    const total = await this.lockerRepository.count();
    const available = await this.lockerRepository.count({ where: { status: LockerStatus.AVAILABLE } });
    const occupied = await this.lockerRepository.count({ where: { status: LockerStatus.OCCUPIED } });
    const reserved = await this.lockerRepository.count({ where: { status: LockerStatus.RESERVED } });
    const maintenance = await this.lockerRepository.count({ where: { status: LockerStatus.MAINTENANCE } });

    return {
      total,
      available,
      occupied,
      reserved,
      maintenance,
      utilization: total > 0 ? ((occupied + reserved) / total * 100).toFixed(1) : 0
    };
  }

  private async createLog(locker: Locker, user: User | null, action: LogAction, metadata?: any): Promise<LockerLog> {
    const log = this.logRepository.create({
      locker,
      user: user ?? undefined,
      action,
      metadata,
      rfid_uid: user?.rfid_uid
    });
    return await this.logRepository.save(log);
  }
}