import { FileResponse } from "utils/generics/file.response";

class SiteDetailResponse {
    name: string;
    address: string;
    isInterest: boolean;
    startDate: Date;
    endDate: Date;
    personInCharge: string;
    personInChargeContact: string;
    contact: string;
}

class CompanyDetailResponse {
    name: string;
    address: string;
    logoFile: FileResponse;
    presentativeName: string;
    email: string;
    contactPhone: string;
}

export class SiteMemberGetDetailResponse {
    site: SiteDetailResponse;
    company: CompanyDetailResponse;
}
