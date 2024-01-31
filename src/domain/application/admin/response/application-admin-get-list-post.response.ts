import { Application, InterviewStatus, Member, Region } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ApplicationAdminResponse {
    name: string;
    contact: Member['contact'];
    isTeam: boolean;
    region: {
        cityEnglishName: Region['cityEnglishName'];
        cityKoreanName: Region['cityKoreanName'];
        districtEnglishName: Region['districtEnglishName'];
        districtKoreanName: Region['districtKoreanName'];
    };
    address: string;
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    desiredSalary: Member['desiredSalary'];
    assignedAt: Application['assignedAt'];
    interviewStatus: InterviewStatus;
}

export class ApplicationAdminGetLisPostResponse extends PaginationResponse<ApplicationAdminResponse> {}
