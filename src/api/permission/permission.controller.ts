import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from '../../configs/constant.config';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionMetadata } from './permission.decorator';
import { PERMISSIONS } from './permission.constant';
import { PermissionGuard } from './permission.guard';
import { PERMISSION_SWAGGER_RESPONSE } from './permission.constant';
import { PermissionsService } from './permission.service';

@Controller({
  path: 'permissions',
  version: API_CONFIG.VERSION_V1,
})
@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOkResponse(PERMISSION_SWAGGER_RESPONSE.GET_PERMISSION_SUCCESS)
  @Get()
  @PermissionMetadata(PERMISSIONS.PERMISSION_READ)
  getPermissions() {
    return this.permissionsService.getPermissions();
  }
}
