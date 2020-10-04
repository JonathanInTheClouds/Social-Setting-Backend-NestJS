import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubSettingEntity } from '../sub-setting/entity/sub-setting.entity';
import { Repository } from 'typeorm';
import { PostEntity } from './entity/post.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class PostService {

  constructor(
    @InjectRepository(SubSettingEntity)
    private readonly subSettingRepository: Repository<SubSettingEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @Inject(REQUEST)
    private request: Request
  ) {}

  async create(postDto: CreatePostDto) {
    const subSettingEntity = await this.subSettingRepository.findOne({name: postDto.subSettingName});

    if (!subSettingEntity)
      throw new NotFoundException('Not Found',
        `"${postDto.postName}" not found`)

    const newPostEntity = new PostEntity();

    Object.keys(postDto).forEach((key) => {
      newPostEntity[key] = postDto[key];
    })

    newPostEntity.user = this.request.user['full'];
    newPostEntity.subSetting = subSettingEntity;

    return await this.postRepository.save(newPostEntity);
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findById(id: number) {
    return await this.postRepository.findOne({id})
  }

  async deleteById(id: number) {
    const postEntityToDelete = await this.postRepository.findOne({id});
    if (!postEntityToDelete)
      throw new NotFoundException('Not Found', `Post #${id} not found`)
    await this.postRepository.remove(postEntityToDelete);
    return postEntityToDelete;
  }
}
