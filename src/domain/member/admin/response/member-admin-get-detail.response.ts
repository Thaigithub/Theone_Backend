import { ApiProperty } from '@nestjs/swagger';
import {
    Account,
    AccountStatus,
    BankAccount,
    Disability,
    DisabledType,
    ForeignWorker,
    Member,
    MemberLevel,
    Team,
} from '@prisma/client';

export class MemberAdminGetDetailResponse {
    @ApiProperty({ type: String })
    name: Member['name'];
    @ApiProperty({ type: String })
    contact: Member['contact'];
    @ApiProperty({ type: String })
    username: Account['username'];
    @ApiProperty({ type: 'enum', enum: AccountStatus })
    status: Account['status'];
    @ApiProperty({ type: 'enum', enum: DisabledType })
    obstacle: Disability['disableType'];
    @ApiProperty({ type: Date })
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
                format: 'date',
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
                format: 'date',
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
                id: {
                    type: 'number',
                },
                name: {
                    type: 'string',
                },
                code: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                        },
                        codeName: {
                            type: 'string',
                        },
                        code: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    })
    teams: {
        id: Team['id'];
        name: Team['name'];
        code: {
            id: number;
            codeName: string;
            code: string;
        };
    }[];
}
