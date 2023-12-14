import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus, Site } from '@prisma/client';

export class SiteCompanyGetDetailResponse {
    @ApiProperty({ type: 'number' })
    id: Site['id'];

    @ApiProperty({ type: 'string' })
    name: Site['name'];

    @ApiProperty({ type: 'string' })
    address: Site['address'];

    @ApiProperty({ type: 'string' })
    contact: Site['contact'];

    @ApiProperty({ type: 'string' })
    personInCharge: Site['personInCharge'];

    @ApiProperty({ type: 'string' })
    personInChargeContact: Site['personInChargeContact'];

    @ApiProperty({ type: 'string' })
    taxInvoiceEmail: Site['taxInvoiceEmail'];

    @ApiProperty({ type: 'string' })
    siteManagementNumber: Site['siteManagementNumber'];

    @ApiProperty({ type: 'enum', enum: ContractStatus })
    contractStatus: Site['contractStatus'];

    @ApiProperty({ type: 'string' })
    startDate: Site['startDate'];

    @ApiProperty({ type: 'string' })
    endDate: Site['endDate'];
}
