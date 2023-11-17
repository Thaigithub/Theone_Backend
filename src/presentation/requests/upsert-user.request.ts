import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export abstract class UpsertUserRequest {
  @Expose()
  @IsNotEmpty()
  @ApiProperty({example: 'walaict'})
  public username: string

  @Expose()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must be at least 8 characters long and contain both letters and numbers',
  })
  @ApiProperty({
    example: 'password',
    description: 'Password must be at least 8 characters long and contain both letters and numbers',
  })
  password: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'the name of an user' })
  public name: string;
}


