/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

// For simplicity, we'll use a string for type in this MVP,
// but validation helps ensure data quality.
export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  type: string; // 'COMMISSION' | 'WITHDRAWAL'

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  status?: string; // 'PENDING' | 'PAID' | 'CANCELLED'
}
