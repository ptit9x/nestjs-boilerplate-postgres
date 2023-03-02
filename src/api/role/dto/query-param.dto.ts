import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsIn, IsNumberString } from 'class-validator';
import { RoleTypes } from '../role.constant';

export class QueryParamDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  search: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  @IsIn([String(RoleTypes.Admin), String(RoleTypes.User)])
  @Transform(({ value }) => value.trim())
  type: string;
}
