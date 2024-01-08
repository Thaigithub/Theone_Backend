import { ApiProperty } from '@nestjs/swagger';
import { MemberLevel, RequestObject, RequestStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';

export class HeadhuntingAdminGetItemApprovalResponse {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: 'Site name' })
    siteName: string;
    @ApiProperty({ example: 'Post name' })
    postName: string;
    @ApiProperty()
    recommendationDate: Date;
    @ApiProperty()
    workername: string;
    @ApiProperty()
    tier: MemberLevel;
    @ApiProperty()
    requestStatus: RequestStatus;
    @ApiProperty()
    matchingStatus: HeadhuntingAdminGetListApprovalMatching;
    @ApiProperty()
    matchingDay: Date;
    @ApiProperty()
    paymentStatus: HeadhuntingAdminGetListApprovalPayment;
    @ApiProperty()
    paymentDate: Date;
    @ApiProperty()
    object: RequestObject;
}

export class HeadhuntingAdminGetListApprovalResponse extends PaginationResponse<HeadhuntingAdminGetItemApprovalResponse> {}
