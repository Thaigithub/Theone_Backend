import { City, Code, District, Member, SpecialLicense, Team } from '@prisma/client';

export class TeamCompanyManpowerGetDetailResponse {
    name: Team['name'];
    totalMembers: Team['totalMembers'];
    cityKoreanName: City['koreanName'];
    districtKoreanName: District['koreanName'];
    leaderContact: Member['contact'];
    leaderTotalExperienceYears: Member['totalExperienceYears'];
    leaderTotalExperienceMonths: Member['totalExperienceMonths'];
    desiredSalary: Team['desiredSalary'];
    members: {
        id: Member['id'];
        name: Member['name'];
        contact: Member['contact'];
        totalExperienceYears: Member['totalExperienceYears'];
        totalExperienceMonths: Member['totalExperienceMonths'];
        desiredOccupations: Code['codeName'][];
    }[];
    specialLicenses: {
        licenseNumber: SpecialLicense['licenseNumber'];
        codeName: Code['codeName'];
    }[];
}
