import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyApplicantsTeamDTO {
    @ApiProperty({ example: 'abc' })
    public name: string;
}
