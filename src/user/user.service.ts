import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ username })
  }

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();

    Object.keys(userDto).forEach((key) => {
      newUser[key] = userDto[key];
    })

    newUser.password = await hash(userDto.password, 10);

    try {
      this.sendEmail();
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

  private sendEmail() {
    this
      .mailerService
      .sendMail({
        to: 'test@nestjs.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {console.log('sent')})
      .catch((error) => {console.log(error)});
  }

}
