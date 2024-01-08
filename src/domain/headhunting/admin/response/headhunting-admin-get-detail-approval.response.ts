import { ApiProperty } from '@nestjs/swagger';
import { HeadhuntingAdminGetDetailApprovalRank } from '../dto/headhunting-admin-get-detail-approval-rank.enum';
import { HeadhuntingAdminGetDetailApprovalGeneral } from './headhunting-admin-get-detail-approval-general.response';
import { Code } from '@prisma/client';

export class HeadhuntingGetDetailApprovalMemberResponse {
    @ApiProperty()
    rank: HeadhuntingAdminGetDetailApprovalRank;

    @ApiProperty()
    name: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    contact: string;

    @ApiProperty()
    desiredOccupations: Code['codeName'][];

    @ApiProperty()
    address: string;

    @ApiProperty()
    certificate: string[];

    @ApiProperty()
    specialOccupation: string[];

    @ApiProperty()
    experienceYears: number;

    @ApiProperty()
    experienceMonths: number;
}

export class HeadhuntingGetDetailApprovalIndividualResponse {
    @ApiProperty()
    general: HeadhuntingAdminGetDetailApprovalGeneral;

    @ApiProperty()
    member: HeadhuntingGetDetailApprovalMemberResponse;
}
