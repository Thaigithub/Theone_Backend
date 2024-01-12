import { Account, BasicHealthSafetyCertificate, Career, City, Code, District, Member, SpecialLicense } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class MemberCompanyManpowerGetDetailResponse {
    name: Member['name'];
    username: Account['username'];
    contact: Member['contact'];
    email: Member['email'];
    district: {
        koreanName: District['koreanName'];
        englishName: District['englishName'];
    };
    city: {
        koreanName: City['koreanName'];
        englishName: City['englishName'];
    };
    desiredSalary: Member['desiredSalary'];
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    desiredOccupations: Code['codeName'][];
    careers: {
        startDate: Career['startDate'];
        endDate: Career['endDate'];
        companyName: Career['companyName'];
        siteName: Career['siteName'];
        codeName: Code['codeName'];
    }[];
    specialLicenses: {
        codeName: Code['codeName'];
        licenseNumber: SpecialLicense['licenseNumber'];
    }[];
    basicHealthSafetyCertificate: {
        registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
        dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
        file: FileResponse;
    };
}
