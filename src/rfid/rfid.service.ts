import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LockersService } from '../lockers/lockers.service';
import { AppWebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class RfidService {
  constructor(
    private usersService: UsersService,
    private lockersService: LockersService,
    private websocketGateway: AppWebSocketGateway,
  ) {}

  async processRfidScan(rfid_uid: string) {
    try {
      // Buscar usuario por RFID
      const user = await this.usersService.findByRfidUid(rfid_uid);
      
      if (!user) {
        // Usuario no registrado
        this.websocketGateway.sendToAll('rfid_scan_result', {
          success: false,
          message: 'RFID no registrado',
          rfid_uid
        });
        return { success: false, message: 'RFID no registrado' };
      }

      // Verificar si el usuario ya tiene un locker asignado
      const existingLocker = user.lockers?.find(l => l.current_user?.id === user.id);
      
      if (existingLocker) {
        // Usuario ya tiene locker asignado - devolver información
        this.websocketGateway.sendToAll('rfid_scan_result', {
          success: true,
          action: 'existing_assignment',
          user: { id: user.id, name: user.name },
          locker: {
            id: existingLocker.id,
            locker_number: existingLocker.locker_number,
            status: existingLocker.status
          }
        });
        
        return {
          success: true,
          action: 'existing_assignment',
          locker_number: existingLocker.locker_number,
          user_name: user.name
        };
      } else {
        // Asignar nuevo locker
        const locker = await this.lockersService.assignLocker(user.id);
        
        this.websocketGateway.sendToAll('rfid_scan_result', {
          success: true,
          action: 'new_assignment',
          user: { id: user.id, name: user.name },
          locker: {
            id: locker.id,
            locker_number: locker.locker_number,
            status: locker.status
          }
        });

        this.websocketGateway.sendToAll('locker_updated', locker);
        
        return {
          success: true,
          action: 'new_assignment',
          locker_number: locker.locker_number,
          user_name: user.name
        };
      }
    } catch (error) {
      this.websocketGateway.sendToAll('rfid_scan_result', {
        success: false,
        message: error.message,
        rfid_uid
      });
      
      return { success: false, message: error.message };
    }
  }
}