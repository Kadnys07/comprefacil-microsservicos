import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { NotificacaoService } from './notificacao.service';

@Controller()
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @EventPattern('pagamento.recebido')
  async tratarPagamentoRecebido(dados: any) {
    return this.notificacaoService.tratarPagamentoRecebido(dados);
  }

  @EventPattern('pagamento.confirmado')
  async tratarPagamentoConfirmado(dados: any) {
    return this.notificacaoService.tratarPagamentoConfirmado(dados);
  }
}
