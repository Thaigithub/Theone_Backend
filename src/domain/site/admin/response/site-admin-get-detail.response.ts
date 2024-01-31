import { Company, Site, Region } from '@prisma/client';

export class SiteAdminGetDetailResponse {
    company: {
        name: Company['name'];
    };
    siteManagementNumber: Site['siteManagementNumber'];
    name: Site['name'];
    address: Site['address'];
    district: {
        koreanName: Region['districtKoreanName'];
        englishName: Region['districtEnglishName'];
        city: {
            koreanName: Region['cityKoreanName'];
            englishName: Region['cityEnglishName'];
        };
    };
    contact: Site['contact'];
    personInCharge: Site['personInCharge'];
    personInChargeContact: Site['personInChargeContact'];
    email: Site['email'];
    taxInvoiceEmail: Site['taxInvoiceEmail'];
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    contractStatus: Site['contractStatus'];
    status: Site['status'];
}
