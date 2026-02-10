import {
  IsNumber,
  IsString,
  IsOptional,
  // IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  // @IsEnum(['COMMISSION', 'WITHDRAWAL', 'BONUS']) // Relaxed for MVP
  type: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  status?: string;
}
