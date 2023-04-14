import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'email',
    example: 'huynhdn@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'abcd1234',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(15)
  password: string;
}
