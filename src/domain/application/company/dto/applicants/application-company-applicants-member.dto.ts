import { ApiProperty } from '@nestjs/swagger';
import { Code, Member, SpecialLicense } from '@prisma/client';

export class ApplicationCompanyApplicantsSpecialDTO {
    @ApiProperty({ example: 'abc' })
    public name: Code['codeName'];

    @ApiProperty({ example: 'abc' })
    public licenseNumber: SpecialLicense['licenseNumber'];
}

export class ApplicationCompanyApplicantsMemberDTO {
    @ApiProperty({ example: 'abc' })
    public name: Member['name'];

    @ApiProperty({ example: 'abc' })
    public contact: Member['contact'];

    @ApiProperty({ example: 'abc' })
    public totalExperienceMonths: Member['totalExperienceMonths'];

    @ApiProperty({ example: 'abc' })
    public totalExperienceYears: Member['totalExperienceYears'];

    @ApiProperty({ type: [ApplicationCompanyApplicantsSpecialDTO] })
    public specialLicenses: ApplicationCompanyApplicantsSpecialDTO[];

    @ApiProperty({ example: 'abc' })
    public desiredSalary: Member['desiredSalary'];

    @ApiProperty({
        type: 'object',
        example: {
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    public city: {
        englishName: string;
        koreanName: string;
    };

    @ApiProperty({
        type: 'object',
        example: {
            englishName: 'Seoul',
            koreanName: '근무지원내역',
        },
    })
    public district: {
        englishName: string;
        koreanName: string;
    };
}
