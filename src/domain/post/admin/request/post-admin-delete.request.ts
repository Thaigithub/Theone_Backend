import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PostAdminDeleteRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @MaxLength(500, { message: 'The reason for deleting notice should be maximun 500 characters' })
    deleteReason: string;
}
