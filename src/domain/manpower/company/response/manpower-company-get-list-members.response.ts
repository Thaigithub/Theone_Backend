import { ApiProperty } from '@nestjs/swagger';
import { Certificate, Code, Member, SpecialLicense } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ManpowerListMembersResponse {
    @ApiProperty({ type: 'number' })
    public id: Member['id'];

    @ApiProperty({ type: 'string' })
    public name: Member['name'];

    @ApiProperty({ type: 'string' })
    public contact: Member['contact'];

    @ApiProperty({ type: 'string' })
    public desiredSalary: Member['desiredSalary'];

    @ApiProperty({ type: 'number' })
    public totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: 'number' })
    public totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ type: 'array' })
    public certificates: Certificate[];

    @ApiProperty({ type: 'array' })
    public specialLicenses: SpecialLicense[];

    @ApiProperty({ type: 'string' })
    public occupation: Code['codeName'];

    @ApiProperty({ type: 'boolean' })
    public isWorking: boolean;

    @ApiProperty({ type: 'number' })
    public numberOfTeams: number;
}

export class ManpowerCompanyGetListMembersResponse extends PaginationResponse<ManpowerListMembersResponse> {}
