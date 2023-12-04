import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Account, AccountStatus, BankAccount, BasicHealthSafetyCertificate, ForeignWorker, Member, MemberLevel, File } from '@prisma/client';

export class MemberResponse {
  @ApiProperty({ type: 'string' })
  id: Member['id'];

  @ApiProperty({ type: 'string' })
  name: Member['name'];

  @ApiProperty({ type: 'string' })
  contact: Member['contact'];

  @ApiProperty({
    type: 'string',
    example: [...Object.values(MemberLevel)],
  })
  level: Member['level'];

  @ApiProperty({
    type: 'object',
    properties: {
      username: {
        type: 'string',
      },
      status: {
        type: 'string',
        example: [...Object.values(AccountStatus)],
      },
    },
  })
  account: {
    username: Account['username'];
    status: Account['status'];
  };
}

export class GetMemberListResponse {
  @ApiProperty({ type: () => [MemberResponse] })
  list: MemberResponse[];

  @ApiProperty({
    type: 'number',
    examples: [0, 1, 2],
  })
  total: number;

  constructor(list: MemberResponse[], total: number) {
    this.list = list;
    this.total = total;
  }
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
