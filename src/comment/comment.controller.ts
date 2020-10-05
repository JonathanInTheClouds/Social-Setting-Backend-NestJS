import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {

  constructor(
    private readonly commentService: CommentService
  ) {}

  @Post()
  create(@Body() commentDto: CreateCommentDto) {
    return this.commentService.create(commentDto);
  }

  @Get()
  find() {
    return this.commentService.findAll();
  }

}
