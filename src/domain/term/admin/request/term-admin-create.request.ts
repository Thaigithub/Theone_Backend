import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TermAdminCreateRequest {
    @Expose()
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    title: string;

    @Expose()
    @MaxLength(5000)
    @IsString()
    @IsNotEmpty()
    content: string;
}
