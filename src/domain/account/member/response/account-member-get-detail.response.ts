import {
    Account,
    BankAccount,
    BasicHealthSafetyCertificate,
    ForeignWorker,
    Member,
    MemberLevel,
    Region,
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
    residenceStatus: ForeignWorker['residenceStatus'];
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
    districtId: Region['id'];
    cityId: Region['cityId'];
    account: {
        username: Account['username'];
        status: Account['status'];
    };
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
