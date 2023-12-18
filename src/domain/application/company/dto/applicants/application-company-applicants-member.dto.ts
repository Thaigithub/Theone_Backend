import { ApiProperty } from '@nestjs/swagger';
import { Member, SpecialLicense } from '@prisma/client';

export class ApplicationCompanyApplicantsSpecialDTO {
    @ApiProperty({ example: 'abc' })
    public name: SpecialLicense['name'];

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

    @ApiProperty({ example: 'abc' })
    public region: Member['region'];
}
