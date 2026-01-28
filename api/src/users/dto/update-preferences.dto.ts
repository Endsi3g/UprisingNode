import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
    @IsBoolean()
    @IsOptional()
    twoFactorEnabled?: boolean;

    @IsBoolean()
    @IsOptional()
    emailNotifications?: boolean;

    @IsBoolean()
    @IsOptional()
    pushNotifications?: boolean;
}
