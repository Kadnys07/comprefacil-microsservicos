import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

// Dados necessários para criar uma nova transação de pagamento
export class CreatePaymentDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}
