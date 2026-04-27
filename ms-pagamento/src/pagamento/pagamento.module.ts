import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAGAMENTO_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
          queue: 'fila_pagamentos',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PagamentoController],
  providers: [PagamentoService, PrismaService],
})
export class PagamentoModule {}
