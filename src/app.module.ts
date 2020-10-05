import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PostModule } from './post/post.module';
import { SubSettingModule } from './sub-setting/sub-setting.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Pro2711,.',
      database: 'social_setting_nestjs',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: '20e2a8a78e5d4c',
          pass: '181d02a948fedd'
        },
        defaults: {
          from:'"nest-modules" <modules@nestjs.com>',
        },
      }
    }),
    UserModule,
    AuthModule,
    PostModule,
    SubSettingModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
