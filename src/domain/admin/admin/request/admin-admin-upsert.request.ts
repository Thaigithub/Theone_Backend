import { AdminLevel, FunctionName } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { AdminAdminUpdateRequest } from './admin-admin-update.request';

export class AdminAdminUpsertRequest extends AdminAdminUpdateRequest {
    @Expose()
    @IsEnum(AdminLevel)
    level: AdminLevel;

    @Expose()
    @IsString()
    @Length(1, 20, { message: 'Administrator name should be maximum 20 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @Expose()
    @IsArray()
    permissions: FunctionName[];
}
