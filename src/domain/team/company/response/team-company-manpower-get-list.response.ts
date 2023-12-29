import { ApiProperty } from '@nestjs/swagger';
import { Member, Team } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ManpowerListTeamsResponse {
    @ApiProperty({ type: 'number' })
    public id: Team['id'];

    @ApiProperty({ type: 'string' })
    public name: Team['name'];

    @ApiProperty({ type: 'string' })
    public leaderName: Member['name'];

    @ApiProperty({ type: 'string' })
    public leaderContact: Member['contact'];

    @ApiProperty({ type: 'string' })
    public desiredSalary: Member['desiredSalary'];

    @ApiProperty({ type: 'number' })
    public totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: 'number' })
    public totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ type: 'string' })
    public totalMembers: Team['totalMembers'];

    @ApiProperty({ type: 'boolean' })
    public isWorking: boolean;
}

export class TeamCompanyManpowerGetListResponse extends PaginationResponse<ManpowerListTeamsResponse> {}
