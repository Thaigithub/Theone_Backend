import { ExperienceType } from '@prisma/client';

export class MatchingMemberGetDetailResponse {
    postId: number;
    isInterested: boolean;
    postName: string;
    startDate: string;
    endDate: string;
    numberOfRecruited: number;
    personInChargeName: string;
    personInChargeContact: string;
    career: ExperienceType;
    occupation: string;
    preferentialTreatment: string;
    detail: string;
    siteName: string;
    siteAddress: string;
    siteStartDate: string;
    siteEndDate: string;
    originalContractor: string;
    originalBuilding: string;
    workLocation: string;
}
