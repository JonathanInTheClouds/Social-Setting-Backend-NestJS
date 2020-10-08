import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {

  constructor(
    private readonly postService: PostService
  ) {}

  @Post()
  create(@Body() postDto: CreatePostDto) {
    return this.postService.create(postDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: number) {
    return this.postService.findById(id);
  }

  @Get()
  findAll() {
    return this.postService.findAllBySubSetting();
  }

  @Delete(':id')
  deleteById(@Param('id') id: number) {
    return this.postService.deleteById(id);
  }

}
