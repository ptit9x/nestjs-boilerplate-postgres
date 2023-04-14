import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from '../../configs/constant.config';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionMetadata } from '../permission/permission.decorator';
import { PERMISSIONS } from '../permission/permission.constant';
import { PermissionGuard } from '../permission/permission.guard';
import { QueryParamDto } from './dto/query-param.dto';
import { ROLE_SWAGGER_RESPONSE } from './role.constant';
import { RoleService } from './role.service';

@Controller({
  path: 'roles',
  version: API_CONFIG.VERSION_V1,
})
@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @ApiOkResponse(ROLE_SWAGGER_RESPONSE.GET_ADMIN_ROLE_SUCCESS)
  @Get()
  @PermissionMetadata(PERMISSIONS.ROLE_SEARCH)
  getRoles(@Query() query: QueryParamDto) {
    return this.rolesService.findRole(query);
  }
}
