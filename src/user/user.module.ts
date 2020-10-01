import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { SecureCodeEntity } from '../auth/entity/secure-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SecureCodeEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
