import { SetMetadata } from '@nestjs/common';
import { PERMISSION_METADATA } from '../../share/common/app.const';

export const PermissionMetadata = (...permissions: string[]) =>
  SetMetadata(PERMISSION_METADATA, permissions);
