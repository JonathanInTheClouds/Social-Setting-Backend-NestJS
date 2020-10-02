import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSettingEntity } from './entity/sub-setting.entity';
import { SubSettingController } from './sub-setting.controller';
import { SubSettingService } from './sub-setting.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubSettingEntity]), AuthModule],
  providers: [SubSettingService],
  exports: [TypeOrmModule],
  controllers: [SubSettingController]
})
export class SubSettingModule {}
