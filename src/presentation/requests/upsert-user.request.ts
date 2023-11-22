import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export abstract class UpsertUserRequest {
  @Expose()
  @IsNotEmpty()
  public username: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsNotEmpty()
  public name: string;
}
