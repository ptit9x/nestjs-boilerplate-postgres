import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEntityDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
