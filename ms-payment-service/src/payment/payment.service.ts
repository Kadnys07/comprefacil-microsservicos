import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService } from './rabbitmq.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMQ: RabbitMQService,
  ) {}

  // Processa o fluxo completo de uma transação de pagamento
  async processarPagamento(dados: CreatePaymentDto) {
    this.logger.log(`Iniciando processamento para usuário: ${dados.userId}`);

    // PASSO I: Armazena a transação com status PENDENTE
    const transacao = await this.prisma.transaction.create({
      data: {
        userId: dados.userId,
        amount: dados.amount,
        description: dados.description ?? '',
        status: 'PENDENTE',
      },
    });

    this.logger.log(`Transação criada com status PENDENTE. ID: ${transacao.id}`);

    // PASSO II: Publica na fila informando que a solicitação foi recebida
    await this.rabbitMQ.publicar('payment.received', {
      transacaoId: transacao.id,
      userId: transacao.userId,
      amount: transacao.amount,
      mensagem: 'Solicitação de pagamento recebida e em processamento.',
    });

    // Simulação do processamento da transação
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // PASSO IV: Atualiza o status para SUCESSO
    const transacaoConfirmada = await this.prisma.transaction.update({
      where: { id: transacao.id },
      data: { status: 'SUCESSO' },
    });

    this.logger.log(`Transação confirmada com status SUCESSO. ID: ${transacaoConfirmada.id}`);

    // PASSO V: Publica na fila informando que o pagamento foi confirmado
    await this.rabbitMQ.publicar('payment.confirmed', {
      transacaoId: transacaoConfirmada.id,
      userId: transacaoConfirmada.userId,
      amount: transacaoConfirmada.amount,
      mensagem: 'Pagamento confirmado com sucesso!',
    });

    return transacaoConfirmada;
  }

  async listarTransacoes() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
