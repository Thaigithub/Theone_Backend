import { $Enums, AccountStatus } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetListRequest {
  @Expose()
  @IsEnum(AccountStatus)
  @IsOptional()
  public status: AccountStatus;

  @Expose()
  @IsEnum($Enums.MemberLevel)
  @IsOptional()
  public level: $Enums.MemberLevel;

  @Expose()
  @IsIn(['username', 'name'])
  @IsString()
  @IsOptional()
  public searchCategory: string;

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
