import { City, Company, District, Site } from '@prisma/client';

export class SiteAdminGetDetailResponse {
    company: {
        name: Company['name'];
    };
    siteManagementNumber: Site['siteManagementNumber'];
    name: Site['name'];
    address: Site['address'];
    district: {
        koreanName: District['koreanName'];
        englishName: District['englishName'];
        city: {
            koreanName: City['koreanName'];
            englishName: City['englishName'];
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
