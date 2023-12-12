import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyMemberDetailSpecialDTO {
    @ApiProperty({ example: 'Device name' })
    public name: string;

    @ApiProperty({ example: 'Registration Number' })
    public licenseNumber: string;
}
