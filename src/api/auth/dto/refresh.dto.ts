import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNjcyMTk2NzcyLCJleHAiOjE2NzIyODMxNzJ9.hMnk4vlSGlXVZQyGu21uTfGL0yjpra9TKVnmtsYXkuY',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  refreshToken: string;
}
