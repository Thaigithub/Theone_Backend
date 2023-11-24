import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export abstract class UpsertAccountRequest {
  @Expose()
  @IsNotEmpty()
  // @ApiProperty({ example: 'walaict' })
  public username: string;

  @Expose()
  @IsNotEmpty()
  // @IsString()
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
  //   message: 'Password must be at least 8 characters long and contain both letters and numbers',
  // })
  // @ApiProperty({
  //   example: 'password',
  //   description: 'Password must be at least 8 characters long and contain both letters and numbers',
  // })
  password: string;
}
