import { ApiProperty } from '@nestjs/swagger';
import { AdminLevel, FunctionName } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { AdminAdminUpdateRequest } from './admin-admin-update.request';

export class AdminAdminUpsertRequest extends AdminAdminUpdateRequest {
    @Expose()
    @IsEnum(AdminLevel)
    @ApiProperty({
        type: 'enum',
        enum: AdminLevel,
        example: AdminLevel.SUPERADMIN,
    })
    public level: AdminLevel;

    @Expose()
    @IsString()
    @ApiProperty({ example: 'abc' })
    @Length(1, 20, { message: 'Administrator name should be maximum 20 characters' })
    @IsNotEmpty({ message: 'Name is required' })
    public name: string;

    @Expose()
    @ApiProperty({
        type: 'FunctionName[]',
        example: ['MEMBER_MANAGEMENT', 'TEAM_MANAGEMENT'],
    })
    public permissions: FunctionName[];
}
