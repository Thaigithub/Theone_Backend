import { PostApplicationStatus } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class ApplicationCompanyGetMemberDetail {
    id: number;
    name: string;
    username: string;
    contact: string;
    email: string;
    city: {
        englishName: string;
        koreanName: string;
    };
    district: {
        englishName: string;
        koreanName: string;
    };
    desiredSalary: number;
    totalExperienceMonths: number;
    totalExperienceYears: number;
    desiredOccupations: {
        codeName: string;
    }[];
    careers: {
        startDate: Date;
        endDate: Date;
        companyName: string;
        siteName: string;
        occupation: string;
    }[];
    specialLicenses: {
        id: number;
        codeName: string;
        licenseNumber: string;
    }[];
    basicHealthSafetyCertificate: {
        registrationNumber: string;
        dateOfCompletion: Date;
        file: FileResponse;
    };
    status: PostApplicationStatus;
}
