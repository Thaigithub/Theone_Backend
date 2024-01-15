import { AccountStatus, MemberLevel } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { searchCategory } from '../dto/member-admin-search-category.request.dto';

class GetMembersListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(AccountStatus)
    @IsOptional()
    status: AccountStatus;

    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    level: MemberLevel;

    @Expose()
    @IsEnum(searchCategory)
    @IsOptional()
    searchCategory: searchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    searchKeyword: string;
}

class ChangeMemberRequest {
    @Expose()
    @IsOptional()
    @IsEnum(MemberLevel)
    level: MemberLevel;

    @Expose()
    @IsOptional()
    @IsEnum(AccountStatus)
    status: AccountStatus;

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
