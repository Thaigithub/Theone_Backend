import { Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';

export class HeadhuntingAdminDenyRequestRequest {
    @Expose()
    @MaxLength(500)
    denyReason: string;
}
