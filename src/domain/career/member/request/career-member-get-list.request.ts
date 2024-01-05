import { CareerCertificationType, CareerType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class CareerMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(CareerType)
    @IsOptional()
    type: CareerType;

    @Expose()
    @IsEnum(CareerCertificationType)
    @IsOptional()
    certificationType: CareerCertificationType;
}
