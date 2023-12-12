import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { CompanyStatus } from '../dto/company-admin-company-status.dto.request.dto';
import { SearchCategory } from '../dto/company-admin-search-category.dto.request.dto';
export class AdminCompanyGetListRequest {
    @Expose()
    @ApiProperty({ description: 'Company status', example: 'GENERAL', type: 'enum', enum: CompanyStatus })
    @IsEnum(CompanyStatus)
    @IsOptional()
    public status: CompanyStatus;

    @Expose()
    @IsOptional()
    @IsEnum(SearchCategory)
    @ApiProperty({ description: 'Search Keyword', example: 'NAME', type: 'enum', enum: SearchCategory })
    public searchCategory: SearchCategory;

    @Expose()
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Company name', example: 'TheOne' })
    public searchKeyword: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ description: 'Page number', example: '1' })
    public pageNumber: string;

    @Expose()
    @IsOptional()
    @IsNumberString()
    @ApiProperty({ description: 'Page size', example: '1' })
    public pageSize: string;
}
