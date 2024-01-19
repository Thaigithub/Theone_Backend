import {
    Account,
    BankAccount,
    BasicHealthSafetyCertificate,
    Career,
    Code,
    Company,
    ForeignWorker,
    Member,
    SpecialLicense,
    Team,
} from '@prisma/client';

export class MemberAdminGetDetailResponse {
    name: Member['name'];
    contact: Member['contact'];
    username: Account['username'];
    status: Account['status'];
    joinDate: string;
    level: Member['level'];
    bankAccount: {
        bankName: BankAccount['bankName'];
        accountNumber: BankAccount['accountNumber'];
        registrationDate: BankAccount['createdAt'];
    };
    foreignWorker: {
        registrationNumber: ForeignWorker['registrationNumber'];
        serialNumber: ForeignWorker['serialNumber'];
        dateOfIssue: ForeignWorker['dateOfIssue'];
    };
    teams: {
        id: Team['id'];
        name: Team['name'];
        occupation: Code['codeName'];
    }[];
    registeredExperienceList: {
        companyName: Career['companyName'];
        startDate: string;
        endDate: string;
    }[];
    contractHistoryList: {
        companyName: Company['name'];
        startDate: string;
        endDate: string;
    }[];
    specialLicenseList: {
        codeName: Code['codeName'];
        acquisitionDate: string;
        status: SpecialLicense['status'];
    }[];
    basicHealthSafetyCertificateList: {
        registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
        dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
    };
    healthInsuranceList: {
        companyName: Career['companyName'];
        startDate: string;
        endDate: string;
    }[];
    employmentInsuranceList: {
        companyName: Career['companyName'];
        startDate: string;
        endDate: string;
    }[];
}
