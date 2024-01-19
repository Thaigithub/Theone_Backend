import { RequestObject } from '@prisma/client';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';

export class HeadhuntingAdminGetDetailApprovalGeneral {
    id: number;
    siteName: string;
    siteContact: string;
    personInCharge: string;
    personInChargeContact: string;
    occupation: string;
    specialOccupation: string;
    career: string;
    object: RequestObject;
    title: string;
    detail: string;
    paymentStatus: HeadhuntingAdminGetListApprovalPayment;
    paymentDate: string;
    paymentAmount: number;
    matchingStatus: HeadhuntingAdminGetListApprovalMatching;
    matchingDay: string;
    email: string;
}
