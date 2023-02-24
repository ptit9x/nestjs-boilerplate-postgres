import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from '../../configs/constant.config';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionMetadata } from './permission.decorator';
import { PERMISSIONS } from './permissions.constant';
import { PermissionsGuard } from './permissions.guard';
import { PERMISSION_SWAGGER_RESPONSE } from './permissions.constant';
import { PermissionsService } from './permissions.service';

@Controller({
  path: 'permissions',
  version: API_CONFIG.VERSION_V1,
})
@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOkResponse(PERMISSION_SWAGGER_RESPONSE.GET_PERMISSION_SUCCESS)
  @Get()
  @PermissionMetadata(PERMISSIONS.PERMISSION_READ)
  getPermissions() {
    return this.permissionsService.getPermissions();
  }
}
