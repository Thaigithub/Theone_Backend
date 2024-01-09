import { Code } from '@prisma/client';
import { HeadhuntingAdminGetDetailApprovalRank } from '../dto/headhunting-admin-get-detail-approval-rank.enum';
import { HeadhuntingAdminGetDetailApprovalGeneral } from './headhunting-admin-get-detail-approval-general.response';
import { HeadhuntingAdminRequestDTO } from '../dto/headhunting-admin-get-detail-request.dto';

export class HeadhuntingGetDetailApprovalMemberResponse {
    rank: HeadhuntingAdminGetDetailApprovalRank;
    name: string;
    username: string;
    contact: string;
    desiredOccupations: Code['codeName'][];
    address: string;
    certificate: string[];
    specialOccupation: string[];
    experienceYears: number;
    experienceMonths: number;
}

export class HeadhuntingGetDetailApprovalIndividualResponse {
    request: HeadhuntingAdminRequestDTO;
    general: HeadhuntingAdminGetDetailApprovalGeneral;
    member: HeadhuntingGetDetailApprovalMemberResponse;
}
