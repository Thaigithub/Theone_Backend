import {
    Account,
    Code,
    Company,
    Headhunting,
    HeadhuntingMatchingStatus,
    HeadhuntingPaymentStatus,
    Member,
    Post,
    RequestObject,
    Site,
    Team,
} from '@prisma/client';
import { HeadhuntingAdminGetDetailRecommendationRank } from '../enum/headhunting-admin-get-detail-recommendation-rank.enum';

export class HeadhuntingAdminGetDetailResponse {
    id: Headhunting['id'];
    companyName: Company['name'];
    phone: Company['phone'];
    siteName: Site['name'];
    presentativeName: Company['presentativeName'];
    occupation: Code['name'];
    object: RequestObject;
    postName: Post['name'];
    detail: string;
    paymentStatus: HeadhuntingPaymentStatus;
    paymentDate: Headhunting['paymentDate'];
    paymentAmount: number;
    email: Company['email'];
    members: {
        name: string;
        username: Account['username'];
        contact: Member['contact'];
        occupations: Code['name'][];
        address: Member['address'];
        totalExperienceYears: Member['totalExperienceYears'];
        totalExperienceMonths: Member['totalExperienceMonths'];
        matchingStatus: HeadhuntingMatchingStatus;
        matchingDate: Date;
    }[];
    teams: {
        name: Team['name'];
        totalMembers: Team['totalMembers'];
        members: {
            rank: HeadhuntingAdminGetDetailRecommendationRank;
            name: Member['name'];
            username: Account['username'];
            contact: Member['contact'];
            address: Member['address'];
            occupations: Code['name'][];
            totalExperienceYears: Member['totalExperienceYears'];
            totalExperienceMonths: Member['totalExperienceMonths'];
        }[];
        matchingStatus: HeadhuntingMatchingStatus;
        matchingDate: Date;
    }[];
}
