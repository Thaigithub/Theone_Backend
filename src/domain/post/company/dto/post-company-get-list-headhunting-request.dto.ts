import { ApiProperty } from '@nestjs/swagger';
import { HeadhuntingRequest } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class PostCompanyGetListHeadhuntingRequestDTO {
    @ApiProperty({ example: 'string' })
    @IsOptional()
    date: HeadhuntingRequest['date'];

    @ApiProperty({ example: 'string' })
    @IsOptional()
    status: HeadhuntingRequest['status'];
}
