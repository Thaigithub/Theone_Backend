import {
    Account,
    BankAccount,
    BasicHealthSafetyCertificate,
    City,
    Code,
    District,
    ForeignWorker,
    Member,
    MemberLevel,
    SignupMethodType,
} from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

class BankAccountType {
    accountHolder: BankAccount['accountHolder'];
    accountNumber: BankAccount['accountNumber'];
    bankName: BankAccount['bankName'];
}
class ForeignWorkerType {
    englishName: ForeignWorker['englishName'];
    registrationNumber: ForeignWorker['registrationNumber'];
    serialNumber: ForeignWorker['serialNumber'];
    dateOfIssue: ForeignWorker['dateOfIssue'];
    file: FileResponse;
}
class DisabilityType extends FileResponse {}
class BasicHealthSafetyCertificateType {
    registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
    dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
    file: FileResponse;
}
export class AccountMemberGetDetailResponse {
    name: Member['name'];
    contact: Member['contact'];
    email: Member['email'];
    desiredSalary: Member['desiredSalary'];
    districtId: District['id'];
    cityId: City['id'];
    account: {
        username: Account['username'];
        status: Account['status'];
    };
    desiredOccupations: {
        codeName: Code['codeName'];
        id: Code['id'];
    }[];
    createdAt: Member['createdAt'];
    level: MemberLevel;
    signupMethod: SignupMethodType;
    totalExperienceMonths: Member['totalExperienceMonths'];
    totalExperienceYears: Member['totalExperienceYears'];
    bankAccount: BankAccountType;
    foreignWorker: ForeignWorkerType;
    disability: DisabilityType;
    basicHealthSafetyCertificate: BasicHealthSafetyCertificateType;
}