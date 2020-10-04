import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { PostController } from './post.controller';
import { SubSettingModule } from '../sub-setting/sub-setting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    SubSettingModule
  ],
  providers: [PostService],
  exports: [PostService, TypeOrmModule],
  controllers: [PostController]
})
export class PostModule {}
