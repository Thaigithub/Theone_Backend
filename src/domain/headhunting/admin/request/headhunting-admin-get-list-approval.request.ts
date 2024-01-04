import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HeadhuntingAdminGetListApprovalCategory } from '../dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';
import { HeadhuntingAdminGetListApprovalStatus } from '../dto/headhunting-admin-get-list-approval-status.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class HeadhuntingAdminGetListApprovalRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public startRecommendationDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public endRecommendationDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalStatus)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalStatus,
        required: false,
    })
    public requestStatus: HeadhuntingAdminGetListApprovalStatus;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalMatching)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalMatching,
        required: false,
    })
    public matchingStatus: HeadhuntingAdminGetListApprovalMatching;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public startMatchingDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public endMatchingDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalPayment)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalPayment,
        required: false,
    })
    public paymentStatus: HeadhuntingAdminGetListApprovalPayment;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public startPaymentDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public endPaymentDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalCategory)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalCategory,
        required: false,
    })
    public category: HeadhuntingAdminGetListApprovalCategory;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    public keyword: string;
}
