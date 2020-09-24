import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  @Post()
  create(@Body() userDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(userDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userToUpdate: CreateUserDto): Promise<UserEntity> {
    return this.userService.update(id, userToUpdate);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

}
