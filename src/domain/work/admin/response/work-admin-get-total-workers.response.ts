import { ApiProperty } from '@nestjs/swagger';

export class WorkerAdminGetTotalWorkersResponse {
    @ApiProperty({ example: 100 })
    totalWorkers: number;
}
