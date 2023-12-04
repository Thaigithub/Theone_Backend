import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export abstract class AccountUpsertRequest {
    @Expose()
    @IsNotEmpty()
    public username: string;

    @Expose()
    @IsNotEmpty()
    password: string;
}
