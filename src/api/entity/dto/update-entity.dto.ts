import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEntityDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;
}
