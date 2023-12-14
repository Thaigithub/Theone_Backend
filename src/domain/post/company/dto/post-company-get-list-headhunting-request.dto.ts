import { ApiProperty } from '@nestjs/swagger';
import { HeadhuntingRequest } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class PostCompanyGetListHeadhuntingRequestDTO {
    @ApiProperty({ example: 'string' })
    @IsOptional()
    public date: HeadhuntingRequest['date'];

    @ApiProperty({ example: 'string' })
    @IsOptional()
    public status: HeadhuntingRequest['status'];
}
