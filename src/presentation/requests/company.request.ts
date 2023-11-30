import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumberString, IsOptional, IsArray, IsNumber, ArrayNotEmpty, IsEnum } from 'class-validator';
import { AccountStatus } from '@prisma/client';
import { $Enums } from '@prisma/client';
export class CompanySearchRequest {
  @Expose()
  @IsEnum($Enums.AccountStatus)
  @ApiProperty({
    type: 'enum',
    enum: AccountStatus,
    required: false,
  })
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
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '1' })
  public pageSize: string;
}

export class CompanyStatusChangeRequest {
  @Expose()
  @IsEnum($Enums.AccountStatus)
  @ApiProperty({
    type: 'enum',
    enum: AccountStatus,
  })
  public status: AccountStatus;
}

export class CompanyDownloadRequest {
  @Expose()
  @IsArray()
  @ArrayNotEmpty({ message: 'The array must not be empty' })
  @IsNumber({}, { each: true, message: 'Each element of the array must be a number' })
  @ApiProperty({ example: [1, 2, 3] })
  public companyIds: number[];
}
