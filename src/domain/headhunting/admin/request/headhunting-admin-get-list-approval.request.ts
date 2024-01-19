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
    startRecommendationDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endRecommendationDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalStatus)
    @IsOptional()
    requestStatus: HeadhuntingAdminGetListApprovalStatus;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalMatching)
    @IsOptional()
    matchingStatus: HeadhuntingAdminGetListApprovalMatching;

    @Expose()
    @IsString()
    @IsOptional()
    startMatchingDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endMatchingDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalPayment)
    @IsOptional()
    paymentStatus: HeadhuntingAdminGetListApprovalPayment;

    @Expose()
    @IsString()
    @IsOptional()
    startPaymentDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endPaymentDate: string;

    @Expose()
    @IsEnum(HeadhuntingAdminGetListApprovalCategory)
    @IsOptional()
    category: HeadhuntingAdminGetListApprovalCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
