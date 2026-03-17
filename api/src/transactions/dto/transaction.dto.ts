import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  type: string; // COMMISSION | WITHDRAWAL

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  status?: string; // PENDING | VALIDATED | PAID | CANCELLED
}
