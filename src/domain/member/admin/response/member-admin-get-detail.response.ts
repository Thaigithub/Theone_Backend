import { ApiProperty } from '@nestjs/swagger';
import { Account, BankAccount, Disability, DisabledType, ForeignWorker, Member, MemberLevel, Team } from '@prisma/client';

export class MemberAdminGetDetailResponse {
    @ApiProperty({ type: String })
    name: Member['name'];
    @ApiProperty({ type: String })
    contact: Member['contact'];
    @ApiProperty({ type: String })
    username: Account['username'];
    @ApiProperty({ type: String })
    status: Account['status'];
    @ApiProperty({ type: 'enum', enum: DisabledType })
    obstacle: Disability['disableType'];
    @ApiProperty({ type: String })
    joinDate: Member['createdAt'];
    @ApiProperty({ type: 'enum', enum: MemberLevel })
    level: Member['level'];
    @ApiProperty({
        type: 'object',
        properties: {
            bankName: {
                type: 'string',
            },
            accountNumber: {
                type: 'string',
            },
            registrationDate: {
                type: 'string',
            },
        },
    })
    bankAccount: {
        bankName: BankAccount['bankName'];
        accountNumber: BankAccount['accountNumber'];
        registrationDate: BankAccount['createdAt'];
    };
    @ApiProperty({
        type: 'object',
        properties: {
            registrationNumber: {
                type: 'string',
            },
            serialNumber: {
                type: 'string',
            },
            dateOfIssue: {
                type: 'string',
            },
        },
    })
    foreignWorker: {
        registrationNumber: ForeignWorker['registrationNumber'];
        serialNumber: ForeignWorker['serialNumber'];
        dateOfIssue: ForeignWorker['dateOfIssue'];
    };
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
                code: {
                    type: 'string',
                },
            },
        },
    })
    teams: {
        name: Team['name'];
        code: Team['code'];
    }[];
}
