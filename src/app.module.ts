import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { LoggerMiddleware } from './share/middlewares/logger.middleware';
import { PermissionsModule } from './api/permission/permission.module';
import { RolesModule } from './api/role/role.module';
import { OrganizationModule } from './api/organization/organization.module';
import { DatabaseModule } from './configs/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PermissionsModule,
    RolesModule,
    UserModule,
    AuthModule,
    OrganizationModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
