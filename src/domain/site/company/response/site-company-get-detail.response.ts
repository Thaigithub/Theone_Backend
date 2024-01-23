import { City, District, Site } from '@prisma/client';

export class SiteCompanyGetDetailResponse {
    id: Site['id'];
    name: Site['name'];
    email: Site['email'];
    address: Site['address'];
    contact: Site['contact'];
    personInCharge: Site['personInCharge'];
    personInChargeContact: Site['personInChargeContact'];
    taxInvoiceEmail: Site['taxInvoiceEmail'];
    siteManagementNumber: Site['siteManagementNumber'];
    contractStatus: Site['contractStatus'];
    startDate: Site['startDate'];
    endDate: Site['endDate'];
    longitude: Site['longitude'];
    latitude: Site['latitude'];
    originalBuilding: Site['originalBuilding'];
    city: City['id'];
    cityKorean: City['koreanName'];
    district: District['id'];
    districtKorean: District['koreanName'];
}
