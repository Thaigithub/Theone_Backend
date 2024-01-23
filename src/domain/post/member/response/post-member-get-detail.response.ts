import { Code, Company, File, Post, Site } from '@prisma/client';

export class PostMemberGetDetailResponse {
    postInformation: {
        status: Post['status'];
        name: Post['name'];
        startDate: string;
        endDate: string;
        numberOfPeople: Post['numberOfPeople'];
        personInCharge: Company['presentativeName'];
    };

    eligibility: {
        experienceType: Post['experienceType'];
        occupation: Code['codeName'];
        specialNote: Code['codeName'];
        otherInformation: Post['otherInformation'];
        isEligibleToApply: boolean;
    };

    detail: Post['postEditor'];

    siteInformation: {
        id: Site['id'];
        companyLogoKey: File['key'];
        siteName: Site['name'];
        siteAddress: Site['address'];
        startDate: string;
        endDate: string;
        longitude: Site['longitude'];
        latitude: Site['latitude'];
        originalBuilding: Site['originalBuilding'];
        originalContractor: Site['contractStatus'];
        isInterest: boolean;
    };
    isInterest: boolean;
}
