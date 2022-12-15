import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from 'src/configs/constant.config';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
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
  getAdminRoles() {
    return this.rolesService.findAdminRole();
  }
}
