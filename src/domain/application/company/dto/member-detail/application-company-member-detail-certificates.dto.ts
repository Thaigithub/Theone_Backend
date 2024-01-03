import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyMemberDetailCertificatesDTO {
    @ApiProperty({ example: 'name' })
    public name: string;

    @ApiProperty({ example: 'name' })
    public certificateNumber: string;
}
