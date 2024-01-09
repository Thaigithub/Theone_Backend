import { Code } from '@prisma/client';
import { HeadhuntingAdminGetDetailApprovalRank } from '../dto/headhunting-admin-get-detail-approval-rank.enum';
import { HeadhuntingAdminRequestDTO } from '../dto/headhunting-admin-get-detail-request.dto';
import { HeadhuntingAdminGetDetailApprovalGeneral } from './headhunting-admin-get-detail-approval-general.response';

export class HeadhuntingGetDetailApprovalMemberResponse {
    rank: HeadhuntingAdminGetDetailApprovalRank;
    name: string;
    username: string;
    contact: string;
    desiredOccupations: Code['codeName'][];
    address: string;
    specialOccupation: string[];
    experienceYears: number;
    experienceMonths: number;
}

export class HeadhuntingGetDetailApprovalIndividualResponse {
    request: HeadhuntingAdminRequestDTO;
    general: HeadhuntingAdminGetDetailApprovalGeneral;
    member: HeadhuntingGetDetailApprovalMemberResponse;
}
