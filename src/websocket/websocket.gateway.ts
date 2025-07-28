import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})
export class AppWebSocketGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.join('dashboard');
    return { event: 'joined', data: 'Conectado al dashboard' };
  }

  // Métodos para enviar datos desde los servicios
  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  sendToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  // Eventos específicos del sistema
  @SubscribeMessage('request_locker_status')
  handleLockerStatusRequest(@ConnectedSocket() client: Socket) {
    // Este método puede ser llamado por el ESP32 para solicitar estado
    client.emit('locker_status_requested');
  }

  @SubscribeMessage('esp32_connection')
  handleEsp32Connection(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('ESP32 conectado:', data);
    client.join('esp32_devices');
    return { event: 'esp32_connected', data: 'ESP32 registrado correctamente' };
  }

  // Enviar comandos al ESP32
  sendCommandToEsp32(lockerId: number, command: string, data?: any) {
    this.server.to('esp32_devices').emit('esp32_command', {
      lockerId,
      command,
      data,
      timestamp: new Date().toISOString()
    });
  }
}