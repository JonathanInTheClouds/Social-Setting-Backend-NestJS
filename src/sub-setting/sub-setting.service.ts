import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateSubSettingDto } from './dto/create-sub-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSettingEntity } from './entity/sub-setting.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core'
import { Request } from 'express';
import { UserEntity } from '../user/entity/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class SubSettingService {

  constructor(
    @InjectRepository(SubSettingEntity)
    private readonly subSettingRepository: Repository<SubSettingEntity>,
    @Inject(REQUEST)
    private request: Request
  ) {}

  async create(subSettingDto: CreateSubSettingDto) {
    const newSubSetting = new SubSettingEntity();

    Object.keys(subSettingDto).forEach((key) => {
      newSubSetting[key] = subSettingDto[key];
    })

    const currentUser: UserEntity = this.request.user['full'];

    newSubSetting.user = currentUser;

    try {
      const subSettingEntity = await this.subSettingRepository.save(newSubSetting);
      return subSettingEntity;
    } catch (e) {
      return e;
    }

  }
}
