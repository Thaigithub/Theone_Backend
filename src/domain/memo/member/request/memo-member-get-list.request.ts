import { Expose } from 'class-transformer';
import { Matches } from 'class-validator';

export class MemoMemberGetListRequest {
    @Expose()
    @Matches(/^\d{4}-\d{2}$/, {
        message: 'month must be in the format yyyy-mm.',
    })
    month: string;
}
