import { Account, BasicHealthSafetyCertificate, Career, City, Code, District, Member, SpecialLicense } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class MemberCompanyManpowerGetDetailResponse {
    name: Member['name'];
    username: Account['username'];
    contact: Member['contact'];
    email: Member['email'];
    cityKoreanName: City['koreanName'];
    districtKoreanName: District['koreanName'];
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
    basicHealthAndSafetyEducation: {
        registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
        dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
        photo: FileResponse;
    };
}
