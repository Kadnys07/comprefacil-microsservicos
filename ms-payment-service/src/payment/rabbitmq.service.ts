import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

// Serviço responsável por publicar mensagens no RabbitMQ
@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;

  private readonly url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue('payment.received', { durable: true });
      await this.channel.assertQueue('payment.confirmed', { durable: true });

      this.logger.log('Conectado ao RabbitMQ com sucesso');
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  async publicar(fila: string, mensagem: object): Promise<void> {
    const conteudo = Buffer.from(JSON.stringify(mensagem));
    this.channel.sendToQueue(fila, conteudo, { persistent: true });
    this.logger.log(`Mensagem publicada na fila [${fila}]`);
  }
}
