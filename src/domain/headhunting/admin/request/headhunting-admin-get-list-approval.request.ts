import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { HeadhuntingAdminGetListApprovalCategory } from '../dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';
import { HeadhuntingAdminGetListApprovalStatus } from '../dto/headhunting-admin-get-list-approval-status.enum';

export class HeadhuntingAdminGetListApprovalRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    startRecommendationDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    endRecommendationDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalStatus)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalStatus,
        required: false,
    })
    requestStatus: HeadhuntingAdminGetListApprovalStatus;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalMatching)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalMatching,
        required: false,
    })
    matchingStatus: HeadhuntingAdminGetListApprovalMatching;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    startMatchingDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    endMatchingDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalPayment)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalPayment,
        required: false,
    })
    paymentStatus: HeadhuntingAdminGetListApprovalPayment;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    startPaymentDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    endPaymentDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalCategory)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: HeadhuntingAdminGetListApprovalCategory,
        required: false,
    })
    category: HeadhuntingAdminGetListApprovalCategory;

    @Expose()
    @IsString()
    @IsOptional()
    @ApiProperty({
        type: 'string',
        required: false,
    })
    keyword: string;
}
