import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserService } from './user/user.service';
import { UserController } from './controller/user/user.controller';
import { UserService } from './service/user/user.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
