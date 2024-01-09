import { City, District, Member, SpecialLicense } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ManpowerListMembersResponse {
    id: Member['id'];
    name: Member['name'];
    contact: Member['contact'];
    cityKoreanName: City['koreanName'];
    districtKoreanName: District['koreanName'];
    desiredSalary: Member['desiredSalary'];
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    specialLicenses: SpecialLicense[];
}

export class MemberCompanyManpowerGetListResponse extends PaginationResponse<ManpowerListMembersResponse> {}
