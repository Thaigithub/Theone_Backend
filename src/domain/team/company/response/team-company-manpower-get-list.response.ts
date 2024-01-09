import { City, District, Member, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ManpowerListTeamsResponse {
    id: Team['id'];
    name: Team['name'];
    totalMembers: Team['totalMembers'];
    cityKoreanName: City['koreanName'];
    districtKoreanName: District['koreanName'];
    leaderContact: Member['contact'];
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    desiredSalary: Member['desiredSalary'];
}

export class TeamCompanyManpowerGetListResponse extends PaginationResponse<ManpowerListTeamsResponse> {}
