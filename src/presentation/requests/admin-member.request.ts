import { $Enums, AccountStatus } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum SearchCategory {
  id = 'id',
  name = 'name',
}

export class AdminMemberRequest {
  @Expose()
  @IsEnum(AccountStatus)
  @IsOptional()
  public status: AccountStatus;

  @Expose()
  @IsEnum($Enums.MemberLevel)
  @IsOptional()
  public level: $Enums.MemberLevel;

  @Expose()
  @IsEnum(SearchCategory)
  @IsOptional()
  public searchCategory: SearchCategory;

  @Expose()
  @IsString()
  @IsOptional()
  public searchKeyword: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  public pageSize: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  public pageNumber: number;
}
