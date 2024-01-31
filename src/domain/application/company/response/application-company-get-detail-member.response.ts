import { PostApplicationStatus, Region } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class ApplicationCompanyGetDetailMemberResponse {
    id: number;
    name: string;
    username: string;
    contact: string;
    email: string;
    city: {
        englishName: Region['cityEnglishName'];
        koreanName: Region['cityKoreanName'];
    };
    district: {
        englishName: Region['districtEnglishName'];
        koreanName: Region['districtKoreanName'];
    };
    desiredSalary: number;
    totalExperienceMonths: number;
    totalExperienceYears: number;
    careers: {
        startDate: Date;
        endDate: Date;
        companyName: string;
        siteName: string;
        occupation: string;
    }[];
    licenses: {
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
