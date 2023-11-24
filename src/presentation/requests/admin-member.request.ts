import { AccountStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminMemberRequest {
  @Expose()
  @IsNumber()
  @IsOptional()
  public page: number;

  @Expose()
  @IsEnum(AccountStatus)
  @IsOptional()
  public status: AccountStatus;

  @Expose()
  @IsString()
  @IsOptional()
  public rating: string;

  @Expose()
  @IsString()
  @IsIn(['id', 'name'])
  @IsOptional()
  public searchCategory: string;

  @Expose()
  @IsString()
  @IsOptional()
  public keyword: string;
}

export class ChangePasswordRequest {
  
}
