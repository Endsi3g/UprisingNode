import { IsString, IsUrl, IsOptional, IsInt, IsNumber } from 'class-validator';

export class CreateLeadDto {
    @IsUrl()
    url: string;

    @IsString()
    @IsOptional()
    companyName?: string;

    @IsString()
    @IsOptional()
    industry?: string;

    @IsNumber()
    @IsOptional()
    value?: number;
}

export class UpdateLeadDto {
    @IsString()
    @IsOptional()
    status?: string;

    @IsInt()
    @IsOptional()
    score?: number;

    @IsNumber()
    @IsOptional()
    value?: number;

    @IsString()
    @IsOptional()
    analysis?: string;
}
