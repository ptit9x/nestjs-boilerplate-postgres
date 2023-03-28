import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class OrganizationDto {
  @ApiProperty({
    description: 'organization name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiPropertyOptional({
    description: `organization's description`,
    example: 'Ha Noi, Viet Name',
  })
  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateOrganizationDto extends OrganizationDto {}
