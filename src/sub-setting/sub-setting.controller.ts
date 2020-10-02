import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubSettingService } from './sub-setting.service';
import { CreateSubSettingDto } from './dto/create-sub-setting.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('subSetting')
export class SubSettingController {

  constructor(
    private readonly subSettingService: SubSettingService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createSubSetting(@Body() subSettingDto: CreateSubSettingDto) {
    return this.subSettingService.create(subSettingDto);
  }

}
