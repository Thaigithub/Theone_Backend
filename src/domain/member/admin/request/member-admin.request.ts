import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, MemberLevel } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { searchCategory } from '../dto/member-admin-search-category.request.dto';

class GetMembersListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'enum',
        enum: AccountStatus,
        required: false,
    })
    @Expose()
    @IsEnum(AccountStatus)
    @IsOptional()
    status: AccountStatus;

    @ApiProperty({
        type: 'enum',
        enum: MemberLevel,
        required: false,
    })
    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    level: MemberLevel;

    @ApiProperty({
        type: 'enum',
        enum: searchCategory,
        required: false,
    })
    @Expose()
    @IsEnum(searchCategory)
    @IsOptional()
    searchCategory: searchCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    searchKeyword: string;
}

class ChangeMemberRequest {
    @ApiProperty({
        type: 'enum',
        enum: MemberLevel,
        required: false,
    })
    @Expose()
    @IsOptional()
    @IsEnum(MemberLevel)
    level: MemberLevel;

    @ApiProperty({
        type: 'enum',
        enum: AccountStatus,
        required: false,
    })
    @Expose()
    @IsOptional()
    @IsEnum(AccountStatus)
    status: AccountStatus;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsOptional()
    @IsString()
    message: string;
}

class DownloadMembersRequest {
    @Expose()
    @IsArray({ message: 'memberIds must be an array' })
    @ArrayNotEmpty({ message: 'The array must not be empty' })
    @IsNumberString({}, { each: true, message: 'Each element of the array must be a number' })
    memberId: string[];
}

class DownloadSingleMemberRequest {
    @Expose()
    @IsNumberString({}, { message: 'Each element of the array must be a number' })
    memberId: string;
}

export { ChangeMemberRequest, DownloadMembersRequest, DownloadSingleMemberRequest, GetMembersListRequest };
