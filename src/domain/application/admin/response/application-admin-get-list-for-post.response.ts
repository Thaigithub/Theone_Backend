import { Application, City, District, InterviewStatus, Member } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ApplicationAdminResponse {
    name: string;
    contact: Member['contact'];
    isTeam: boolean;
    city: {
        englishName: City['englishName'];
        koreanName: City['koreanName'];
    };
    district: {
        englishName: District['englishName'];
        koreanName: District['koreanName'];
    };
    address: string;
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    desiredSalary: Member['desiredSalary'];
    assignedAt: Application['assignedAt'];
    interviewStatus: InterviewStatus;
}

export class ApplicationAdminGetResponse extends PaginationResponse<ApplicationAdminResponse> {}
