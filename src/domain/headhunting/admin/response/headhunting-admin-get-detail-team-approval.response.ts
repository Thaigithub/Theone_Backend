import { HeadhuntingAdminRequestDTO } from '../dto/headhunting-admin-get-detail-request.dto';
import { HeadhuntingAdminGetDetailApprovalGeneral } from './headhunting-admin-get-detail-approval-general.response';
import { HeadhuntingGetDetailApprovalMemberResponse } from './headhunting-admin-get-detail-approval.response';

export class HeadhuntingGetDetailApprovalTeamResponse {
    general: HeadhuntingAdminGetDetailApprovalGeneral;
    teamName: string;
    numberOfMembers: number;
    members: HeadhuntingGetDetailApprovalMemberResponse[];
    request: HeadhuntingAdminRequestDTO;
}
