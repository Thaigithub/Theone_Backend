import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, MemberLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetListRequest {
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
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  public pageSize: number;

  @ApiProperty({
    type: 'number',
    required: false,
  })
  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  public pageNumber: number;
}

export class ChangeMemberRequest {
  @ApiProperty({
    type: 'number',
  })
  @Expose()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  public id: number;

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

export class MemberDownloadRequest {
  @Expose()
  @IsArray()
  @ArrayNotEmpty({ message: 'The array must not be empty' })
  @IsNumber({}, { each: true, message: 'Each element of the array must be a number' })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
    example: [1, 2, 3],
  })
  public memberIds: number[];
}
