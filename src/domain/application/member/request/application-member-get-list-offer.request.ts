import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ApplicationMemberGetListOfferFilter } from '../enum/application-member-get-list-offer-filter.enum';

export class ApplicationMemberGetListOfferRequest extends PaginationRequest {
    @IsString()
    @IsOptional()
    @Expose()
    postName: string;

    @IsEnum(ApplicationMemberGetListOfferFilter)
    @Expose()
    @IsOptional()
    filter: ApplicationMemberGetListOfferFilter;
}
