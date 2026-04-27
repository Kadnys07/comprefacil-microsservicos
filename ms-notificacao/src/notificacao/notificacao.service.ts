import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificacaoService {
  private readonly logger = new Logger(NotificacaoService.name);

  async tratarPagamentoRecebido(dados: any) {
    this.logger.log('='.repeat(50));
    this.logger.log('NOTIFICAÇÃO: Solicitação de pagamento recebida!');
    this.logger.log(`   Usuário: ${dados.usuarioId}`);
    this.logger.log(`   Transação ID: ${dados.transacaoId}`);
    this.logger.log(`   Valor: R$ ${dados.valor.toFixed(2)}`);
    this.logger.log(`   Status: ${dados.mensagem}`);
    this.logger.log('='.repeat(50));
  }

  async tratarPagamentoConfirmado(dados: any) {
    this.logger.log('='.repeat(50));
    this.logger.log('NOTIFICAÇÃO: Pagamento confirmado com sucesso!');
    this.logger.log(`   Usuário: ${dados.usuarioId}`);
    this.logger.log(`   Transação ID: ${dados.transacaoId}`);
    this.logger.log(`   Valor: R$ ${dados.valor.toFixed(2)}`);
    this.logger.log(`   Status: ${dados.mensagem}`);
    this.logger.log('='.repeat(50));
  }
}
