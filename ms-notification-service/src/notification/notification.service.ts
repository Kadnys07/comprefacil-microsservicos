import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

// Serviço responsável por consumir mensagens do RabbitMQ e enviar notificações
@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private connection: amqp.ChannelModel;
  private channel: amqp.Channel;

  private readonly url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  async onModuleInit() {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();

      // Garante que as filas existam antes de consumir
      await this.channel.assertQueue('payment.received', { durable: true });
      await this.channel.assertQueue('payment.confirmed', { durable: true });

      this.logger.log('Serviço de Notificação conectado ao RabbitMQ');

      // Inicia o consumo das duas filas
      this.consumirFilaRecebimento();
      this.consumirFilaConfirmacao();
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ:', error);
    }
  }

  // PASSO III: Consome a fila de recebimento e notifica o usuário
  private consumirFilaRecebimento() {
    this.channel.consume('payment.received', (msg) => {
      if (!msg) return;

      const dados = JSON.parse(msg.content.toString());

      this.logger.log('='.repeat(50));
      this.logger.log('NOTIFICACAO: Solicitacao de pagamento recebida!');
      this.logger.log(`   Usuario: ${dados.userId}`);
      this.logger.log(`   Transacao ID: ${dados.transacaoId}`);
      this.logger.log(`   Valor: R$ ${dados.amount.toFixed(2)}`);
      this.logger.log(`   Status: ${dados.mensagem}`);
      this.logger.log('='.repeat(50));

      // Confirma o processamento da mensagem
      this.channel.ack(msg);
    });
  }

  // PASSO VI: Consome a fila de confirmacao e notifica o usuário
  private consumirFilaConfirmacao() {
    this.channel.consume('payment.confirmed', (msg) => {
      if (!msg) return;

      const dados = JSON.parse(msg.content.toString());

      this.logger.log('='.repeat(50));
      this.logger.log('NOTIFICACAO: Pagamento confirmado com sucesso!');
      this.logger.log(`   Usuario: ${dados.userId}`);
      this.logger.log(`   Transacao ID: ${dados.transacaoId}`);
      this.logger.log(`   Valor: R$ ${dados.amount.toFixed(2)}`);
      this.logger.log(`   Status: ${dados.mensagem}`);
      this.logger.log('='.repeat(50));

      // Confirma o processamento da mensagem
      this.channel.ack(msg);
    });
  }
}
