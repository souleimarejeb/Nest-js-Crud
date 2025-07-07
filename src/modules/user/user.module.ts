import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports:[TypeOrmModule.forRoot()],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
