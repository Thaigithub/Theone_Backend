import { ApiProperty } from '@nestjs/swagger';
import { Certificate, Code, Member, SpecialLicense } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ManpowerListMembersResponse {
    @ApiProperty({ type: 'number' })
    id: Member['id'];

    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'string' })
    desiredSalary: Member['desiredSalary'];

    @ApiProperty({ type: 'number' })
    totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: 'number' })
    totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ type: 'array' })
    certificates: Certificate[];

    @ApiProperty({ type: 'array' })
    specialLicenses: SpecialLicense[];

    @ApiProperty({ type: 'string' })
    desiredOccupations: Code['codeName'][];

    @ApiProperty({ type: 'boolean' })
    isWorking: boolean;

    @ApiProperty({ type: 'number' })
    numberOfTeams: number;
}

export class MemberCompanyManpowerGetListResponse extends PaginationResponse<ManpowerListMembersResponse> {}
