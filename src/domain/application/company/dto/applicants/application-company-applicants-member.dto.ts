import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyApplicantsMemberDTO {
    @ApiProperty({ example: 'abc' })
    public name: string;

    @ApiProperty()
    public Career: any;
}
