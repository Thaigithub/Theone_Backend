import { ApiProperty } from '@nestjs/swagger';
import { Member, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ManpowerListTeamsResponse {
    @ApiProperty({ type: 'number' })
    id: Team['id'];

    @ApiProperty({ type: 'string' })
    name: Team['name'];

    @ApiProperty({ type: 'string' })
    leaderName: Member['name'];

    @ApiProperty({ type: 'string' })
    leaderContact: Member['contact'];

    @ApiProperty({ type: 'string' })
    desiredSalary: Member['desiredSalary'];

    @ApiProperty({ type: 'number' })
    totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: 'number' })
    totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ type: 'string' })
    totalMembers: Team['totalMembers'];

    @ApiProperty({ type: 'boolean' })
    isWorking: boolean;
}

export class TeamCompanyManpowerGetListResponse extends PaginationResponse<ManpowerListTeamsResponse> {}
