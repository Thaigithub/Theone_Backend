import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length, IsBoolean } from 'class-validator';

export class CompanySearchRequest {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'asdfgasdgads' })
  public idtoken: string;

  @Expose()
  @IsBoolean()
  @ApiProperty({ example: 'true' })
  public member: boolean;
}