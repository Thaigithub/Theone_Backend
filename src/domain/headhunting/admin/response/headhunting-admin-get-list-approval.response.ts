import { MemberLevel, RequestObject, RequestStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';

export class HeadhuntingAdminGetItemApprovalResponse {
    id: number;
    siteName: string;
    postName: string;
    recommendationDate: Date;
    workername: string;
    tier: MemberLevel;
    requestStatus: RequestStatus;
    matchingStatus: HeadhuntingAdminGetListApprovalMatching;
    matchingDay: Date;
    paymentStatus: HeadhuntingAdminGetListApprovalPayment;
    paymentDate: Date;
    object: RequestObject;
}

export class HeadhuntingAdminGetListApprovalResponse extends PaginationResponse<HeadhuntingAdminGetItemApprovalResponse> {}
