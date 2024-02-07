import { Code, License, Member, Team } from '@prisma/client';

export class TeamCompanyGetDetailResponse {
    name: Team['name'];
    totalMembers: Team['totalMembers'];
    cityKoreanName: string;
    districtKoreanName: string;
    leaderContact: Member['contact'];
    leader: {
        contact: Member['contact'];
        isChecked: boolean;
    };
    leaderTotalExperienceYears: Member['totalExperienceYears'];
    leaderTotalExperienceMonths: Member['totalExperienceMonths'];
    desiredSalary: Team['desiredSalary'];
    members: {
        id: Member['id'];
        name: Member['name'];
        contact: Member['contact'];
        totalExperienceYears: Member['totalExperienceYears'];
        totalExperienceMonths: Member['totalExperienceMonths'];
        desiredOccupations: Code['name'][];
        isChecked: boolean;
        licenses: {
            licenseNumber: License['licenseNumber'];
            codeName: Code['name'];
        }[];
    }[];
    licenses: {
        licenseNumber: License['licenseNumber'];
        codeName: Code['name'];
    }[];
}
