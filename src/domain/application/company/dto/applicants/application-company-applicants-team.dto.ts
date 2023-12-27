import { ApiProperty } from '@nestjs/swagger';
import { Member } from '@prisma/client';

export class ApplicationCompanyApplicantsLeaderDTO {
    @ApiProperty({ example: 'abc' })
    public contact: string;

    @ApiProperty({ example: 'abc' })
    public totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ example: 'abc' })
    public totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ example: 'abc' })
    public desiredSalary: Member['desiredSalary'];
}

export class ApplicationCompanyApplicantsTeamDTO {
    @ApiProperty({ example: 'abc' })
    public name: string;

    @ApiProperty({ example: 'abc' })
    public district: {
        englishName: string;
        koreanName: string;
        city: {
            englishName: string;
            koreanName: string;
        };
    };

    @ApiProperty({ type: ApplicationCompanyApplicantsLeaderDTO })
    public leader: ApplicationCompanyApplicantsLeaderDTO;
}
