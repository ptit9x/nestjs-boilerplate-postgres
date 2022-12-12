import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateInternaleUserDto {
  @ApiProperty({
    description: 'name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'expired_date',
  })
  @IsString()
  @MaxLength(100)
  expired_date: string;

  @ApiPropertyOptional({
    description: 'country',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiPropertyOptional({
    description: 'city',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiPropertyOptional({
    description: 'postalCode',
  })
  @IsOptional()
  @IsInt()
  postalCode: number;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  phone: string;
}

export class CreateUserDtoBatch {
  @ApiProperty({
    description: 'name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    description: 'expired_date',
  })
  @Matches(
    /^(((0[1-9])|([12][0-9])|(3[01]))\/((0[0-9])|(1[012]))\/((20[012]\d|19\d\d)|(1\d|2[0123])))$/,
  )
  @MaxLength(100)
  expired_date: string;

  @ApiPropertyOptional({
    description: 'country',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(100)
  country: string;

  @ApiPropertyOptional({
    description: 'city',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @MaxLength(100)
  city: string;

  @ApiPropertyOptional({
    description: 'postalCode',
  })
  @IsOptional()
  @IsInt()
  postalCode: number;

  @ApiPropertyOptional({
    description: 'phone',
  })
  @IsOptional()
  @IsNumberString()
  @MinLength(8)
  @MaxLength(15)
  phone: string;
}
export class CreateMultilpleUsersDto {
  @ApiProperty({
    description: 'users',
    type: [CreateUserDtoBatch],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateUserDtoBatch)
  users: CreateUserDtoBatch[];
}
