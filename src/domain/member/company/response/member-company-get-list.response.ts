import { City, District, Member, SpecialLicense } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListResponse {
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

export class MemberCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
