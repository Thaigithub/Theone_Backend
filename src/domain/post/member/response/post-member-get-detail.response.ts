import { Code, Company, File, Post, Site } from '@prisma/client';

export class PostMemberGetDetailResponse {
    public postInformation: {
        name: Post['name'];
        startDate: string;
        endDate: string;
        numberOfPeople: Post['numberOfPeople'];
        personInCharge: Company['presentativeName'];
    };

    public eligibility: {
        experienceType: Post['experienceType'];
        occupation: Code['codeName'];
        specialNote: Code['codeName'];
        otherInformation: Post['otherInformation'];
        isEligibleToApply: boolean;
    };

    public detail: Post['postEditor'];

    public siteInformation: {
        id: Site['id'];
        companyLogoKey: File['key'];
        siteName: Site['name'];
        siteAddress: Site['address'];
        startDate: string;
        endDate: string;
        originalBuilding: Site['originalBuilding'];
        isInterest: boolean;
    };

    public workLocation: Post['workLocation'];
}
