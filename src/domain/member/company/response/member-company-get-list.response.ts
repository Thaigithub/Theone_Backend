import { Account, License, Member, Region } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListResponse {
    id: Member['id'];
    name: Member['name'];
    contact: Member['contact'];
    cityKoreanName: Region['cityKoreanName'];
    districtKoreanName: Region['districtKoreanName'];
    desiredSalary: Member['desiredSalary'];
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    licenses: License[];
    occupations: string[];
    isActive: Account['isActive'];
}

export class MemberCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
