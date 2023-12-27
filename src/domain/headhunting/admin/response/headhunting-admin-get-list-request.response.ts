import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class HeadhuntingAdminGetItemRequestResponse {
    @ApiProperty({ example: 1 })
    public id: number;
    @ApiProperty({ example: 'Company name' })
    public companyName: string;
    @ApiProperty({ example: 'Site name' })
    public siteName: string;
    @ApiProperty({ example: 'Post name' })
    public postName: string;
    @ApiProperty({ example: RequestStatus.APPLY })
    public status: RequestStatus;
    @ApiProperty({ example: '2023-12-18T00:00:00.000Z' })
    public date: Date;
}

export class HeadhuntingAdminGetListRequestResponse extends PaginationResponse<HeadhuntingAdminGetItemRequestResponse> {}
