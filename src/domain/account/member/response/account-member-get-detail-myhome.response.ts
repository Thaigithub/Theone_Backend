import { ApiProperty } from '@nestjs/swagger';
import { Account, Member, MemberLevel, SignupMethodType } from '@prisma/client';

export class AccountMemberGetDetailMyHomeReponse {
    @ApiProperty({ type: 'string' })
    public name: Member['name'];

    @ApiProperty({ type: 'string' })
    public username: Account['username'];

    @ApiProperty({ type: 'string' })
    public email: Member['email'];

    @ApiProperty({ type: 'string' })
    public contact: Member['contact'];

    @ApiProperty({ type: 'enum', enum: MemberLevel })
    public level: Member['level'];

    @ApiProperty({ type: 'enum', enum: SignupMethodType })
    public registrationMethod: Member['signupMethod'];

    @ApiProperty({ type: 'string', format: 'date' })
    public registrationDate: Member['createdAt'];

    @ApiProperty({ type: 'number' })
    public totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: 'number' })
    public totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({
        type: 'object',
        properties: {
            totalApplications: {
                type: 'number',
            },
            totalInterviews: {
                type: 'number',
            },
            totalContracts: {
                type: 'number',
            },
        },
    })
    public supportWork: {
        totalApplications: number;
        totalInterviews: number;
        totalContracts: number;
    };

    @ApiProperty({
        type: 'object',
        properties: {
            totalShifts: {
                type: 'number',
            },
            totalEvaluations: {
                type: 'number',
            },
        },
    })
    public siteActivity: {
        totalShifts: number;
        totalEvaluations: number;
    };
}
