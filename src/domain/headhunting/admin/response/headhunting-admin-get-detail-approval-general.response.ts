import { ApiProperty } from '@nestjs/swagger';
import { RequestObject } from '@prisma/client';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';

export class HeadhuntingAdminGetDetailApprovalGeneral {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public siteName: string;

    @ApiProperty()
    public siteContact: string;

    @ApiProperty()
    public personInCharge: string;

    //Request
    @ApiProperty()
    occupation: string;

    @ApiProperty()
    specialOccupation: string;

    @ApiProperty()
    career: string;

    @ApiProperty()
    object: RequestObject;

    @ApiProperty()
    title: string;

    @ApiProperty()
    detail: string;

    //Payment
    @ApiProperty()
    paymentStatus: HeadhuntingAdminGetListApprovalPayment;

    @ApiProperty()
    paymentDate: string;

    @ApiProperty()
    paymentAmount: number;

    @ApiProperty()
    matchingStatus: HeadhuntingAdminGetListApprovalMatching;

    @ApiProperty()
    matchingDay: string;
}
