import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsUUID,
  // IsEnum, // Removed unused import
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  type: string; // 'COMMISSION' | 'WITHDRAWAL' | 'ADJUSTMENT'

  @IsString()
  status: string; // 'PENDING' | 'PAID' | 'CANCELLED'

  @IsString()
  description: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  status?: string;
}
