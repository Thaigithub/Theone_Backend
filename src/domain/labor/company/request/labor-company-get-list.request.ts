import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { LaborType } from '../enum/labor-company-labor-type.enum';

export class LaborCompanyGetListRequest {
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public startDate: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public endDate: string;

    @IsOptional()
    @Expose()
    @IsEnum(LaborType)
    public type: LaborType;

    @IsOptional()
    @Expose()
    @IsString()
    public keyword: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
}
