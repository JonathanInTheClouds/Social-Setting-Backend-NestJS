import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();

    Object.keys(userDto).forEach((key) => {
      newUser[key] = userDto[key];
    })

    try {
      return this.userRepository.save(newUser);
    } catch (e) {
      return e;
    }
  }

  async update(id: string, updatedUserDto: CreateUserDto): Promise<UserEntity> {
    const target = await this.userRepository.findOne(id);

    if (!target) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    Object.keys(updatedUserDto).forEach((key) => {
      target[key] = updatedUserDto[key];
    })

    try {
      return this.userRepository.save(target);
    } catch (e) {
      return e
    }
  }

  async delete(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    try {
      return this.userRepository.remove(user);
    } catch (e) {
      return e
    }
  }


}
