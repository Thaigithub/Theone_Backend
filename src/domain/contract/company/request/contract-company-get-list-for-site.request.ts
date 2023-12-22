import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export class ContractCompanyGetListForSiteRequest {
    @Expose()
    @IsNumberString()
    @IsOptional()
    @ApiProperty({
        type: String,
    })
    public pageSize: string;

    @Expose()
    @IsNumberString()
    @IsOptional()
    @ApiProperty({
        type: String,
    })
    public pageNumber: string;
}
