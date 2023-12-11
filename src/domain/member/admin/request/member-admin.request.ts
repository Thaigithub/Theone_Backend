import { AccountStatus, MemberLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class GetMembersListRequest {
    @ApiProperty({
        type: 'enum',
        enum: AccountStatus,
        required: false,
    })
    @Expose()
    @IsEnum(AccountStatus)
    @IsOptional()
    public status: AccountStatus;

    @ApiProperty({
        type: 'enum',
        enum: MemberLevel,
        required: false,
    })
    @Expose()
    @IsEnum(MemberLevel)
    @IsOptional()
    public level: MemberLevel;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keywordByUsername: string;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keywordByName: string;

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

class ChangeMemberRequest {
    @ApiProperty({
        type: MemberLevel,
        required: false,
    })
    @Expose()
    @IsOptional()
    @IsEnum(MemberLevel)
    public level: MemberLevel;

    @ApiProperty({
        type: AccountStatus,
        required: false,
    })
    @Expose()
    @IsOptional()
    @IsEnum(AccountStatus)
    public status: AccountStatus;
}

class DownloadMembersRequest {
    @Expose()
    @IsArray({ message: 'memberIds must be an array' })
    @ArrayNotEmpty({ message: 'The array must not be empty' })
    @IsNumberString({}, { each: true, message: 'Each element of the array must be a number' })
    public memberId: string[];
}

class DownloadSingleMemberRequest {
    @Expose()
    @IsNumberString({}, { message: 'Each element of the array must be a number' })
    public memberId: string;
}

export { GetMembersListRequest, ChangeMemberRequest, DownloadSingleMemberRequest, DownloadMembersRequest };
