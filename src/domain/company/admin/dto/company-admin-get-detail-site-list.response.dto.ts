import { ApiProperty } from '@nestjs/swagger';
import { Site } from '@prisma/client';

export class CompanyAdminGetDetailCompanySiteList {
    @ApiProperty({ type: Number })
    id: Site['id'];
    @ApiProperty({ type: String })
    name: Site['name'];
}
