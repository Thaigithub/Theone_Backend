import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetMemberCertificateRequest {
  @Expose()
  @IsNumber()
  @IsOptional()
  public memberId: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 1 })
  public page: number;

  @Expose()
  @IsNumber()
  @ApiProperty({ example: 20 })
  public size: number;
}
