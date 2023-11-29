import { $Enums, Account, BankAccount, BasicHealthSafetyCertificate, File, ForeignWorker, Member } from '@prisma/client';

export class MemberResponse {
  id: Member['id'];
  name: Member['name'];
  contact: Member['contact'];
  level: Member['level'];
  account: {
    username: Account['username'];
    status: Account['status'];
  };
}

export class MemberDetailsResponse {
  name: Member['name'];
  contact: Member['contact'];
  email: Member['email'];
  desiredOccupation: Member['desiredOccupation'];
  level: Member['level'];
  signupMethod: Member['signupMethod'];
  bankAccount: {
    accountHolder: BankAccount['accountHolder'];
    accountNumber: BankAccount['accountNumber'];
    bankName: BankAccount['bankName'];
  };
  foreignWorker: {
    englishName: ForeignWorker['englishName'];
    registrationNumber: ForeignWorker['registrationNumber'];
    serialNumber: ForeignWorker['serialNumber'];
    dateOfIssue: ForeignWorker['dateOfIssue'];
    file: {
      key: File['key'];
      fileName: File['fileName'];
      size: File['size'];
    };
  };
  disability: {
    disableType: $Enums.DisabledType;
    file: {
      key: File['key'];
      fileName: File['fileName'];
      size: File['size'];
    };
  };
  basicHealthSafetyCertificate: {
    registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
    dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
    file: {
      key: File['key'];
      fileName: File['fileName'];
      size: File['size'];
    };
  };
}

export class GetListResponse {
  members: MemberResponse[];
  total: number;

  constructor(members: MemberResponse[], total: number) {
    this.members = members;
    this.total = total;
  }
}
