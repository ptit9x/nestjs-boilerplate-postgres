import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from '../../configs/constant.config';
import { ParamIdBaseDto } from '../../share/common/dto/query-param.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PERMISSIONS } from '../permission/permission.constant';
import { PermissionMetadata } from '../permission/permission.decorator';
import { PermissionGuard } from '../permission/permission.guard';
import { SWAGGER_RESPONSE } from './organization.constant';
import { OrganizationEntity } from './organization.entity';
import { OrganizationService } from './organization.service';
import { OrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { QueryParamDto } from './dto/query-param.dto';

@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'organizations',
})
@ApiTags('Organization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOkResponse(SWAGGER_RESPONSE.SEARCH_SUCCESS)
  @Get()
  @PermissionMetadata(PERMISSIONS.ORGANIZATION_SEARCH)
  search(@Query() query: QueryParamDto) {
    return this.organizationService.search(query);
  }

  @ApiOkResponse(SWAGGER_RESPONSE.VIEW_DETAIL_SUCCESS)
  @Get(':id')
  @PermissionMetadata(PERMISSIONS.ORGANIZATION_READ)
  get(@Param() param: ParamIdBaseDto) {
    return this.organizationService.get(+param.id);
  }

  @ApiOkResponse(SWAGGER_RESPONSE.CREATED_SUCCESS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PermissionMetadata(PERMISSIONS.ORGANIZATION_CREATE)
  public create(@Body() body: OrganizationDto): Promise<OrganizationEntity> {
    return this.organizationService.create(body);
  }

  @ApiOkResponse(SWAGGER_RESPONSE.UPDATE_SUCCESS)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @PermissionMetadata(PERMISSIONS.ORGANIZATION_EDIT)
  update(@Param() param: ParamIdBaseDto, @Body() body: UpdateOrganizationDto) {
    return this.organizationService.update(+param.id, body, {
      name: body.name,
    });
  }

  @Delete(':id')
  @ApiOkResponse(SWAGGER_RESPONSE.UPDATE_SUCCESS)
  @PermissionMetadata(PERMISSIONS.ORGANIZATION_DELETE)
  delete(@Param() param: ParamIdBaseDto) {
    return this.organizationService.delete(+param.id);
  }
}
