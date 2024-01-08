import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PostAdminDeleteRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
        example: 'The reason for deleting notice',
    })
    @MaxLength(500, { message: 'The reason for deleting notice should be maximun 500 characters' })
    deleteReason: string;
}
