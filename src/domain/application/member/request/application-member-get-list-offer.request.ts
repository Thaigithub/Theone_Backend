import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApplicationMemberGetListOfferFilter } from '../enum/application-member-get-list-offer-filter.enum';

export class ApplicationMemberGetListOfferRequest {
    @IsString()
    @IsOptional()
    @Expose()
    @ApiProperty({
        type: String,
    })
    public postName: string;
    @IsEnum(ApplicationMemberGetListOfferFilter)
    @Expose()
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: ApplicationMemberGetListOfferFilter,
    })
    public filter: ApplicationMemberGetListOfferFilter;

    @IsNumberString()
    @IsOptional()
    @ApiProperty({
        type: Number,
    })
    public pageSize: string;

    @IsNumberString()
    @IsOptional()
    @ApiProperty({
        type: Number,
    })
    public pageNumber: string;
}
