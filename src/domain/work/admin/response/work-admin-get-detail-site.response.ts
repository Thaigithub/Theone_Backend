import { ApiProperty } from '@nestjs/swagger';

export class WorkAdminGetDetailSiteResponse {
    //On-site information
    @ApiProperty({ example: 'string' })
    siteName: string;

    @ApiProperty({ example: 'string' })
    siteContact: string;

    @ApiProperty({ example: 'string' })
    siteAddress: string;

    @ApiProperty({ example: 'string' })
    startDate: string;

    @ApiProperty({ example: 'string' })
    endDate: string;

    @ApiProperty({ example: 'string' })
    manager: string;

    @ApiProperty({ example: 'string' })
    managerContact: string;
}
