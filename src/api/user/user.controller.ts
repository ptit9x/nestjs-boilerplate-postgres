import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { API_CONFIG } from 'src/configs/constant.config';
import { IAdminPayload } from 'src/share/common/app.interface';
import { GetUser } from 'src/share/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionMetadata } from '../permissions/permission.decorator';
import { PERMISSIONS } from '../permissions/permissions.constant';
import { PermissionsGuard } from '../permissions/permissions.guard';
import {
  CreateInternaleUserDto,
  CreateMultilpleUsersDto,
} from './dto/create-user.dto';
import { QueryParamDto } from './dto/query-param.dto';
import { ChangeUserPasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { USER_SWAGGER_RESPONSE } from './user.constant';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'user',
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse(USER_SWAGGER_RESPONSE.GET_LIST_SUCCESS)
  @Get('info')
  @HttpCode(HttpStatus.OK)
  public getInternalUser(@GetUser('email') email: string): Promise<UserEntity> {
    return this.userService.getByEmail(email);
  }

  @ApiOkResponse(USER_SWAGGER_RESPONSE.UPDATE_SUCCESS)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @GetUser() user: IAdminPayload,
    @Body() body: ChangeUserPasswordDto,
  ) {
    return this.userService.changePassword(user.sub, body);
  }

  @ApiOkResponse(USER_SWAGGER_RESPONSE.UPDATE_SUCCESS)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  public async updateUser(
    @Param() params: { id: number },
    @Body() updateDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.updateUser(params.id, updateDto);
  }

  @ApiOkResponse(USER_SWAGGER_RESPONSE.GET_LIST_SUCCESS)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @PermissionMetadata(PERMISSIONS.USER_READ)
  public findUser(@Query() queryParamDto: QueryParamDto): Promise<any> {
    return this.userService.findUser(queryParamDto);
  }
}
