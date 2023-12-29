import { ApiProperty } from '@nestjs/swagger';
import { MemberLevel, RequestObject, RequestStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';

export class HeadhuntingAdminGetItemApprovalResponse {
    @ApiProperty({ example: 1 })
    public id: number;
    @ApiProperty({ example: 'Site name' })
    public siteName: string;
    @ApiProperty({ example: 'Post name' })
    public postName: string;
    @ApiProperty()
    public recommendationDate: Date;
    @ApiProperty()
    public workername: string;
    @ApiProperty()
    public tier: MemberLevel;
    @ApiProperty()
    public requestStatus: RequestStatus;
    @ApiProperty()
    public matchingStatus: HeadhuntingAdminGetListApprovalMatching;
    @ApiProperty()
    public matchingDay: Date;
    @ApiProperty()
    public paymentStatus: HeadhuntingAdminGetListApprovalPayment;
    @ApiProperty()
    public paymentDate: Date;
    @ApiProperty()
    public object: RequestObject;
}

export class HeadhuntingAdminGetListApprovalResponse extends PaginationResponse<HeadhuntingAdminGetItemApprovalResponse> {}
