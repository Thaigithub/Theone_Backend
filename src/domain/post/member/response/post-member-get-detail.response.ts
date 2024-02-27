import { Application, Code, Company, File, Post, Site } from '@prisma/client';

export class PostMemberGetDetailResponse {
    postInformation: {
        status: Post['status'];
        name: Post['name'];
        startDate: string;
        endDate: string;
        numberOfPeople: Post['numberOfPeoples'];
        personInCharge: Company['presentativeName'];
    };

    eligibility: {
        experienceType: Post['experienceType'];
        codeName: Code['name'];
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
        originalContractor: Site['contractStatus'];
        isInterest: boolean;
    };
    isInterest: boolean;
    applicationId: Application['id'];
}
