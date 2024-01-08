import { ApiProperty } from '@nestjs/swagger';

export class PostCompanyCountPostsResponse {
    @ApiProperty({ example: 1 })
    countPost: number;
}
