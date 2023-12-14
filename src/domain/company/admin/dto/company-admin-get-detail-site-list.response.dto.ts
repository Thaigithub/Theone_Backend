import { ApiProperty } from '@nestjs/swagger';
import { Site } from '@prisma/client';

export class CompanyAdminGetDetailCompanySiteList {
    @ApiProperty({ type: Number })
    public id: Site['id'];
    @ApiProperty({ type: String })
    public name: Site['name'];
}
