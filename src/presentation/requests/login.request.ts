import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length, IsBoolean } from 'class-validator';

export class SocialLoginRequest {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'asdfgasdgads' })
  public idtoken: string;

  @Expose()
  @IsBoolean()
  @ApiProperty({ example: 'true' })
  public member: boolean;
}

export class LoginRequest {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'user@example.com' })
  public username: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'password123456' })
  public password: string;
}

export class ChangePasswordRequest {
  @Expose()
  @IsString()
  @Length(8)
  @ApiProperty({ example: 'password123456' })
  public newPassword: string;
}
