import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { SecureCodeEntity } from '../auth/entity/secure-code.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SecureCodeEntity)
    private readonly secureCodeRepository: Repository<SecureCodeEntity>,
    private readonly mailerService: MailerService
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ username }, { select: [
      'username', 'password', 'profileName', 'isActive', 'createdDate', 'email', 'id'
      ] })
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ email })
  }

  async create(userDto: CreateUserDto): Promise<UserEntity> {
    await this.throwIfInvalidFields(userDto);

    const newUser = new UserEntity();

    Object.keys(userDto).forEach((key) => {
      newUser[key] = userDto[key];
    })

    newUser.password = await hash(userDto.password, 10);

    try {
      const secureCodeEntity = new SecureCodeEntity();
      secureCodeEntity.code = this.getRandom(5);
      secureCodeEntity.user = newUser;
      const savedSecureCode = await this.secureCodeRepository.save(secureCodeEntity);
      this.sendEmail(secureCodeEntity.code);
      Logger.debug(`Created ${savedSecureCode.user.username}`)
      return savedSecureCode.user;
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

  private sendEmail(randomNumber: number) {
    this
      .mailerService
      .sendMail({
        to: 'test@nestjs.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: `${randomNumber}`, // plaintext body
        // html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {Logger.debug('Email sent')})
      .catch((error) => {console.log(error)});
  }

  private getRandom = length =>
    Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));

  private async throwIfInvalidFields(userDto: CreateUserDto) {
    this.throwIfInvalidEmail(userDto.email);
    await this.throwIfUserExist(userDto);
  }

  private throwIfInvalidEmail = (email: string) => {
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
      throw new BadRequestException('Invalid Email', 'Please Enter Valid Email')
  };

  private async throwIfUserExist(userDto: CreateUserDto) {
    const userFromEmail = await this.findOneByEmail(userDto.email);
    const userFromUsername = await this.findOneByUsername(userDto.username);
    const errorSubject = 'Existing Field(s)';
    if (userFromEmail && userFromUsername)
      throw new ConflictException(errorSubject, 'Email & Username already Exist');
    if (userFromEmail)
      throw new ConflictException(errorSubject, 'Email already Exist');
    if (userFromUsername)
      throw new ConflictException(errorSubject, 'Username already Exist');
  }
}
