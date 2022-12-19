import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from 'src/configs/constant.config';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionMetadata } from '../permissions/permission.decorator';
import { PERMISSIONS } from '../permissions/permissions.constant';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { QueryParamDto } from './dto/query-param.dto';
import { ROLE_SWAGGER_RESPONSE } from './roles.constant';
import { RolesService } from './roles.service';

@Controller({
  path: 'roles',
  version: API_CONFIG.VERSION_V1,
})
@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse(ROLE_SWAGGER_RESPONSE.GET_ADMIN_ROLE_SUCCESS)
  @Get()
  @PermissionMetadata(PERMISSIONS.ROLE_READ)
  getRoles(@Query() query: QueryParamDto) {
    return this.rolesService.findRole(query);
  }
}
