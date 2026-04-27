import { Body, Controller, Get, Post } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { CriarPagamentoDto } from './dto/criar-pagamento.dto';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  // POST /pagamento — recebe a solicitação de transação
  @Post()
  async criarPagamento(@Body() dados: CriarPagamentoDto) {
    return this.pagamentoService.processarPagamento(dados);
  }

  // GET /pagamento — lista todas as transações
  @Get()
  async listarPagamentos() {
    return this.pagamentoService.listarTransacoes();
  }
}
