import { ApiProperty } from '@nestjs/swagger';
import { ContentType } from 'application/services/storage.service';
import { Expose } from 'class-transformer';
// import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FileUploadRequest {
  @ApiProperty({ required: true })
  @Expose()
  @IsEnum(ContentType)
  @IsNotEmpty()
  public contentType: ContentType;

  @ApiProperty({ required: true })
  @Expose()
  @IsString()
  @IsNotEmpty()
  public fileName: string;
}
