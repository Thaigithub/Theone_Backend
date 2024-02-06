import { Account, BasicHealthSafetyCertificate, Career, Code, License, Member } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class MemberCompanyGetDetailResponse {
    name: Member['name'];
    username: Account['username'];
    contact: Member['contact'];
    email: Member['email'];
    district: {
        koreanName: string;
        englishName: string;
    };
    city: {
        koreanName: string;
        englishName: string;
    };
    desiredSalary: Member['desiredSalary'];
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    careers: {
        startDate: Career['startDate'];
        endDate: Career['endDate'];
        companyName: Career['companyName'];
        siteName: Career['siteName'];
        occupation: Code['name'];
    }[];
    licenses: {
        codeName: Code['name'];
        licenseNumber: License['licenseNumber'];
    }[];
    basicHealthSafetyCertificate: {
        registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
        dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
        file: FileResponse;
    };
    occupations: Code['name'][];
    isChecked: boolean;
}
