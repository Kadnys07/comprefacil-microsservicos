import { Module } from '@nestjs/common';
import { NotificacaoModule } from './notificacao/notificacao.module';

@Module({
  imports: [NotificacaoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
