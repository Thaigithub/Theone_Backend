import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyMemberDetailSpecialDTO {
    @ApiProperty({ example: 'Device name' })
    name: string;

    @ApiProperty({ example: 'Registration Number' })
    licenseNumber: string;
}
