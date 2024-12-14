import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class MessagingService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  // Para emitir un mensaje a la cola
  async publishMessage(queue: string, message: any) {
    return this.client.emit(queue, message);
  }

  // Para consumir un mensaje de la cola (debe ser llamado en el controlador o en un gateway)
  async consumeMessage(queue: string, callback: (message: any) => void) {
    this.client.send(queue, {}).subscribe(callback);
  }
}
