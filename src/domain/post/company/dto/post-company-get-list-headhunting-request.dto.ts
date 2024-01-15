import { HeadhuntingRequest } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class PostCompanyGetListHeadhuntingRequestDTO {
    @IsOptional()
    date: HeadhuntingRequest['date'];

    @IsOptional()
    status: HeadhuntingRequest['status'];
}
