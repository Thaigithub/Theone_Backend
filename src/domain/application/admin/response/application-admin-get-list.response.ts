import { InterviewStatus, Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ApplicationAdminResponse {
    name: string;
    contact: string;
    isTeam: boolean;
    city: {
        englishName: string;
        koreanName: string;
    };
    district: {
        englishName: string;
        koreanName: string;
    };
    address: string;
    totalExperienceYears: number;
    totalExperienceMonths: number;
    desiredSalary: Member['desiredSalary'];
    assignedAt: Date;
    interviewStatus: InterviewStatus;
}

export class ApplicationAdminGetResponse extends PaginationResponse<ApplicationAdminResponse> {}
