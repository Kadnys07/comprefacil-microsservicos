import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

// Dados necessários para criar uma nova transação de pagamento
export class CriarPagamentoDto {
  @IsString()
  usuarioId: string;

  @IsNumber()
  @Min(0.01)
  valor: number;

  @IsString()
  @IsOptional()
  descricao?: string;
}
