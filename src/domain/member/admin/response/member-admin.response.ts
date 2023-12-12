import { ApiProperty } from '@nestjs/swagger';
import {
    $Enums,
    Account,
    AccountStatus,
    BankAccount,
    BasicHealthSafetyCertificate,
    File,
    ForeignWorker,
    Member,
    MemberLevel,
    SignupMethodType,
} from '@prisma/client';

class MemberResponse {
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

class GetMembersListResponse {
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
class BankAccountType {
    @ApiProperty({ type: String })
    accountHolder: BankAccount['accountHolder'];
    @ApiProperty({ type: String })
    accountNumber: BankAccount['accountNumber'];
    @ApiProperty({ type: String })
    bankName: BankAccount['bankName'];
}
class FileType {
    @ApiProperty({ type: String })
    key: File['key'];
    @ApiProperty({ type: String })
    fileName: File['fileName'];
    @ApiProperty({ type: Number })
    size: File['size'];
    @ApiProperty({ type: 'enum', enum: $Enums.FileType })
    type: File['type'];
}
class ForeignWorkerType {
    @ApiProperty({ type: String })
    englishName: ForeignWorker['englishName'];
    @ApiProperty({ type: String })
    registrationNumber: ForeignWorker['registrationNumber'];
    @ApiProperty({ type: String })
    serialNumber: ForeignWorker['serialNumber'];
    @ApiProperty({ type: String })
    dateOfIssue: ForeignWorker['dateOfIssue'];
    @ApiProperty({ type: FileType })
    file: FileType;
}
class DisabilityType {
    @ApiProperty({ type: 'enum', enum: $Enums.DisabledType })
    disableType: $Enums.DisabledType;
    @ApiProperty({ type: 'enum', enum: $Enums.DisabledLevel })
    disableLevel: $Enums.DisabledLevel;
    @ApiProperty({ type: FileType })
    file: FileType;
}
class BasicHealthSafetyCertificateType {
    @ApiProperty({ type: String })
    registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
    @ApiProperty({ type: String })
    dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
    @ApiProperty({ type: FileType })
    file: FileType;
}
class MemberDetailResponse {
    @ApiProperty({ type: String })
    name: Member['name'];
    @ApiProperty({ type: String })
    contact: Member['contact'];
    @ApiProperty({ type: String })
    email: Member['email'];
    @ApiProperty({ type: String })
    desiredOccupation: Member['desiredOccupation'];
    @ApiProperty({ type: 'enum', enum: MemberLevel })
    level: Member['level'];
    @ApiProperty({ type: 'enum', enum: SignupMethodType })
    signupMethod: Member['signupMethod'];
    @ApiProperty({ type: BankAccountType })
    bankAccount: BankAccountType;
    @ApiProperty({ type: ForeignWorkerType })
    foreignWorker: ForeignWorkerType;
    @ApiProperty({ type: DisabilityType })
    disability: DisabilityType;
    @ApiProperty({ type: BasicHealthSafetyCertificateType })
    basicHealthSafetyCertificate: BasicHealthSafetyCertificateType;
}

export { GetMembersListResponse, MemberDetailResponse, MemberResponse };
