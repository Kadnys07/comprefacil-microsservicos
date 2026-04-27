import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { CriarPagamentoDto } from './dto/criar-pagamento.dto';

@Injectable()
export class PagamentoService {
  private readonly logger = new Logger(PagamentoService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('PAGAMENTO_SERVICE') private readonly client: ClientProxy,
  ) {}

  // Processa o fluxo completo de uma transação de pagamento
  async processarPagamento(dados: CriarPagamentoDto) {
    this.logger.log(`Iniciando processamento para usuário: ${dados.usuarioId}`);

    // PASSO I: Armazena a transação com status PENDENTE
    const transacao = await this.prisma.transacao.create({
      data: {
        usuarioId: dados.usuarioId,
        valor: dados.valor,
        descricao: dados.descricao ?? '',
        status: 'PENDENTE',
      },
    });

    this.logger.log(`Transação criada com status PENDENTE. ID: ${transacao.id}`);

    // PASSO II: Publica na fila informando que a solicitação foi recebida
    this.client.emit('pagamento.recebido', {
      transacaoId: transacao.id,
      usuarioId: transacao.usuarioId,
      valor: transacao.valor,
      mensagem: 'Solicitação de pagamento recebida e em processamento.',
    });

    // Simulação do processamento da transação
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // PASSO IV: Atualiza o status para SUCESSO
    const transacaoConfirmada = await this.prisma.transacao.update({
      where: { id: transacao.id },
      data: { status: 'SUCESSO' },
    });

    this.logger.log(`Transação confirmada com status SUCESSO. ID: ${transacaoConfirmada.id}`);

    // PASSO V: Publica na fila informando que o pagamento foi confirmado
    this.client.emit('pagamento.confirmado', {
      transacaoId: transacaoConfirmada.id,
      usuarioId: transacaoConfirmada.usuarioId,
      valor: transacaoConfirmada.valor,
      mensagem: 'Pagamento confirmado com sucesso!',
    });

    return transacaoConfirmada;
  }

  async listarTransacoes() {
    return this.prisma.transacao.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
