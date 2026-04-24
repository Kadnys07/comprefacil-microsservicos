import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // POST /payment — recebe a solicitação de transação
  @Post()
  async criarPagamento(@Body() dados: CreatePaymentDto) {
    return this.paymentService.processarPagamento(dados);
  }

  // GET /payment — lista todas as transações
  @Get()
  async listarPagamentos() {
    return this.paymentService.listarTransacoes();
  }
}
