import { ApiProperty } from '@nestjs/swagger';
import { HeadhuntingAdminGetDetailApprovalGeneral } from './headhunting-admin-get-detail-approval-general.response';
import { HeadhuntingGetDetailApprovalMemberResponse } from './headhunting-admin-get-detail-approval.response';

export class HeadhuntingGetDetailApprovalTeamResponse {
    @ApiProperty()
    general: HeadhuntingAdminGetDetailApprovalGeneral;

    @ApiProperty()
    teamName: string;

    @ApiProperty()
    numberOfMembers: number;

    @ApiProperty()
    members: HeadhuntingGetDetailApprovalMemberResponse[];
}
