import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class HeadhuntingAdminGetItemRequestResponse {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Company name' })
    companyName: string;
    @ApiProperty({ example: 'Site name' })
    siteName: string;
    @ApiProperty({ example: 'Post name' })
    postName: string;
    @ApiProperty({ example: 'Object' })
    object: string;
    @ApiProperty({ example: RequestStatus.APPLY })
    status: RequestStatus;
    @ApiProperty({ example: '2023-12-18T00:00:00.000Z' })
    date: Date;
}

export class HeadhuntingAdminGetListRequestResponse extends PaginationResponse<HeadhuntingAdminGetItemRequestResponse> {}
