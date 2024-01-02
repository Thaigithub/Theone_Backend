import { ApiProperty } from '@nestjs/swagger';

export class ApplicationCompanyCountApplicationsResponse {
    @ApiProperty({ example: 1 })
    public countApplications: number;
}
