import { ApiProperty } from '@nestjs/swagger';
import { CareerType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class GetCareerListRequest {
  @ApiProperty({
    type: 'enum',
    enum: CareerType,
    required: false,
  })
  @Expose()
  @IsEnum(CareerType)
  @IsOptional()
  public type: CareerType;

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

export class CreateCareerRequest {
  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  public companyName: string;

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  public siteName: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Expose()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'The property must be in the format yyyy-mm-dd.',
  })
  public startDate: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
  })
  @Expose()
  @IsDateString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'The property must be in the format yyyy-mm-dd.',
  })
  public endDate: string;

  @ApiProperty({
    type: 'string',
  })
  @Expose()
  @IsString()
  public occupation: string;

  @ApiProperty({
    type: 'boolean',
  })
  @Expose()
  @IsBoolean()
  public isExperienced: boolean;
}
