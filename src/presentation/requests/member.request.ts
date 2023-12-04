import { AccountStatus, DisabledLevel, DisabledType, FileType, MemberLevel } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsISO8601, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpsertDisabilityRequest {
  @Expose()
  @IsEnum(DisabledLevel)
  @ApiProperty({
    type: 'enum',
    enum: DisabledLevel,
    example: DisabledLevel,
  })
  public disabledLevel: DisabledLevel;

  @Expose()
  @IsEnum(DisabledType)
  @ApiProperty({
    type: 'enum',
    enum: DisabledType,
    example: DisabledType.BURN,
  })
  public disabledType: DisabledType;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'asdfhjawbecqertq' })
  public fileKey: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'basic.pdf' })
  public fileName: string;

  @Expose()
  @IsEnum(FileType)
  @ApiProperty({
    type: 'enum',
    enum: FileType,
    example: FileType.PDF,
  })
  public fileType: FileType;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 100 })
  public fileSize: number;
}

export class UpsertHSTCertificateRequest {
  @Expose()
  @IsString()
  @ApiProperty({ example: '123456' })
  public registrationNumber: string;

  @Expose()
  @IsISO8601()
  @ApiProperty({ example: '2020-10-10T00:00:00Z' })
  public dateOfCompletion: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'asdfhjawbecqertq' })
  public fileKey: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'basic.pdf' })
  public fileName: string;

  @Expose()
  @IsEnum(FileType)
  @ApiProperty({
    type: 'enum',
    enum: FileType,
    example: FileType.PDF,
  })
  public fileType: FileType;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 100 })
  public fileSize: number;
}

export class UpsertForeignWorkerRequest {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'The One' })
  public englishName: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: '123456' })
  public registrationNumber: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: '123456' })
  public serialNumber: string;

  @Expose()
  @IsISO8601()
  @ApiProperty({ example: '2020-10-10T00:00:00Z' })
  public dateOfIssue: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'asdfhjawbecqertq' })
  public fileKey: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'basic.pdf' })
  public fileName: string;

  @Expose()
  @IsEnum(FileType)
  @ApiProperty({
    type: 'enum',
    enum: FileType,
    example: FileType.PDF,
  })
  public fileType: FileType;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 100 })
  public fileSize: number;
}

export class UpsertBankAccountRequest {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'TheOne' })
  public accountHolder: string;

  @Expose()
  @IsNumberString()
  @ApiProperty({ example: '1233534' })
  public accountNumber: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'ACB' })
  public bankName: string;
}

export class GetMemberListRequest {
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

export class ChangeMemberRequest {
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
