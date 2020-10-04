import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateSubSettingDto } from './dto/create-sub-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSettingEntity } from './entity/sub-setting.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

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

    newSubSetting.user = this.request.user['full'];

    try {
      return await this.subSettingRepository.save(newSubSetting);
    } catch (e) {
      return e;
    }

  }

  async findAll() {
    return await this.subSettingRepository.find({
      relations: ['posts', 'user']
    });
  }

  async findById(id: number) {
    return await this.subSettingRepository.findOne({ id }, {
      relations: ['posts']
    })
  }

  async deleteById(id: number) {
    const subSettingEntityToDelete = await this.subSettingRepository.findOne({id});
    if (!subSettingEntityToDelete)
      throw new NotFoundException('Not Found', `SubSetting #${id} not found`)
    return await this.subSettingRepository.remove(subSettingEntityToDelete);
  }
}
