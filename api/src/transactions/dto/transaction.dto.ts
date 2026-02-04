import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  type: string; // 'COMMISSION' | 'WITHDRAWAL'

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  status?: string; // 'PENDING' | 'PAID' | 'CANCELLED'
}
