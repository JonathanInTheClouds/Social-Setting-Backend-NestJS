import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubSettingService } from './sub-setting.service';
import { CreateSubSettingDto } from './dto/create-sub-setting.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subSetting')
export class SubSettingController {

  constructor(
    private readonly subSettingService: SubSettingService
  ) {}


  @Post()
  createSubSetting(@Body() subSettingDto: CreateSubSettingDto) {
    return this.subSettingService.create(subSettingDto);
  }

  @Get()
  findAllSubSettings() {
    return this.subSettingService.findAll();
  }

  @Get(':id')
  findSubSettingById(@Param('id') id: number) {
    return this.subSettingService.findById(id);
  }

  @Delete(':id')
  deleteSubSettingById(@Param('id') id: number) {
    return this.subSettingService.deleteById(id);
  }
}
