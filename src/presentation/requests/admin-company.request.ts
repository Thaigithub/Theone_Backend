import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumberString, IsOptional, IsEnum } from 'class-validator';
import { AccountStatus } from '@prisma/client';
import { $Enums } from '@prisma/client';
export class CompanySearchRequest {
  @Expose()
  @IsEnum($Enums.AccountStatus)
  public status: AccountStatus;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'TheOne' })
  public name: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '0123456789' })
  public phone: string;

  @Expose()
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '1' })
  public id: string;

  @Expose()
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '1' })
  public pageNumber: string;

  @Expose()
  @IsNumberString()
  @ApiProperty({ example: '1' })
  public pageSize: string;
}

export class CompanyStatusChangeRequest {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'APPROVED' })
  public status: AccountStatus;
}
