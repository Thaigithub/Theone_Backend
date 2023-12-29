import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { HeadhuntingAdminGetListApprovalCategory } from '../dto/headhunting-admin-get-list-approval-category.enum';
import { HeadhuntingAdminGetListApprovalMatching } from '../dto/headhunting-admin-get-list-approval-matching.enum';
import { HeadhuntingAdminGetListApprovalPayment } from '../dto/headhunting-admin-get-list-approval-payment.enum';
import { HeadhuntingAdminGetListApprovalStatus } from '../dto/headhunting-admin-get-list-approval-status.enum';

export class HeadhuntingAdminGetListApprovalRequest {
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

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
}
