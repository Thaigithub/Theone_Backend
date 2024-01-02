import { ApiProperty } from '@nestjs/swagger';

export class MemberCompanyCountWorkersResponse {
    @ApiProperty({ type: Number })
    countWorkers: number;
}
