import {
    Account,
    BankAccount,
    BasicHealthSafetyCertificate,
    Career,
    Code,
    Company,
    ForeignWorker,
    Member,
    License,
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
        occupation: Code['name'];
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
    licenseList: {
        codeName: Code['name'];
        acquisitionDate: string;
        status: License['status'];
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
