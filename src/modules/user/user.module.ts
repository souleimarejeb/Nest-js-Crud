import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserExistsMiddleware } from 'src/common/middlewares/user-exists.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/models/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserExistsMiddleware)
      .exclude({ path: '/user', method: RequestMethod.POST })
      .exclude({ path: '/user', method: RequestMethod.GET })
      .forRoutes(UserController)

  }
}
