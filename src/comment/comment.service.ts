import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommentEntity } from './entity/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from '../user/entity/user.entity';
import { PostEntity } from '../post/entity/post.entity';

@Injectable({
  scope: Scope.REQUEST
})
export class CommentService {

  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @Inject(REQUEST)
    private readonly request: Request
  ) {}


  async create(commentDto: CreateCommentDto) {

    const targetPost = await this.postRepository.findOne({ id: commentDto.postId });

    const currentUser: UserEntity = this.request.user['full'];

    if (!targetPost || !currentUser)
      throw new NotFoundException('Not Found');

    const newComment = new CommentEntity();

    Object.keys(commentDto).forEach((key) => {
      newComment[key] = commentDto[key];
    })

    newComment.user = currentUser;
    newComment.posts = targetPost;

    return await this.commentRepository.save(newComment);

  }

  async findAll() {
    return await this.commentRepository.find({
      relations: ['user']
    });
  }

  async delete(id: number) {
    const targetComment = await this.commentRepository.findOne({ id });
    if (!targetComment)
      throw new NotFoundException('Not Found', `ID: ${targetComment.id} not found`)
    return await this.commentRepository.remove(targetComment);
  }

}
