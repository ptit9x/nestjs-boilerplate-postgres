import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { QueryParamBaseDto } from '../../../share/common/dto/query-param.dto';

export class QueryParamDto extends QueryParamBaseDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  status?: string;
}
