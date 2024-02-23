import { File, Site, Region } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListResponse {
    id: Site['id'];
    name: Site['name'];
    personInCharge: Site['personInCharge'];
    personInChargeContact: Site['personInChargeContact'];
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    cityKoreanName: Region['cityKoreanName'];
    cityEnglishName: Region['cityEnglishName'];
    districtKoreanName: Region['districtKoreanName'];
    districtEnglishName: Region['districtEnglishName'];
    companyLogoKey: File['key'];
}

export class SiteCompanyGetListResponse extends PaginationResponse<GetListResponse> {}
