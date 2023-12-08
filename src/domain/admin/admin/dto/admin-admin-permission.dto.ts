import { ApiProperty } from '@nestjs/swagger';
import { FunctionDTO } from './admin-admin-function.dto';

export class PermissionDTO {
    @ApiProperty({ type: FunctionDTO })
    function: FunctionDTO;
}
