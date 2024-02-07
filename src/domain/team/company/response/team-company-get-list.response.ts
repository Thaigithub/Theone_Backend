import { Member, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListResponse {
    id: Team['id'];
    name: Team['name'];
    totalMembers: Team['totalMembers'];
    cityKoreanName: string;
    districtKoreanName: string;
    leader: {
        contact: Member['contact'];
        isChecked: boolean;
    };
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    desiredSalary: Member['desiredSalary'];
}

export class TeamCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
