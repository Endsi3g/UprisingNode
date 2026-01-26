import { IsString, IsUrl, IsOptional, IsInt } from 'class-validator';

export class CreateLeadDto {
    @IsUrl()
    url: string;

    @IsString()
    @IsOptional()
    companyName?: string;

    @IsString()
    @IsOptional()
    industry?: string;
}

export class UpdateLeadDto {
    @IsString()
    @IsOptional()
    status?: string;

    @IsInt()
    @IsOptional()
    score?: number;

    @IsString()
    @IsOptional()
    analysis?: string;
}
