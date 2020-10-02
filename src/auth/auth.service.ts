import { Injectable, Logger, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../user/interface/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { SecureCodeEntity } from './entity/secure-code.entity';
import { Repository } from 'typeorm';
import { SecureCodeDto } from './dto/secure-code.dto';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SecureCodeEntity)
    private secureCodeRepository: Repository<SecureCodeEntity>,
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user = await this.userService.findOneByUsername(username);
    if (!user.isActive) throw new UnauthorizedException('Please check your email for validation');
    const isPasswordMatching = await compare(password, user.password);
    if (user && isPasswordMatching) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async verifySecureCode(secureCode: SecureCodeDto): Promise<{ access_token: string }> {
    const secureCodeEntity = await this.secureCodeRepository.findOne({code: secureCode.code});
    if (!secureCodeEntity) throw new NotFoundException(`${secureCode.code} not found.`);
    const user = secureCodeEntity.user;
    const payload = { username: user.username, sub: user.id }
    user.isActive = true
    await this.userEntityRepository.save(user);
    await this.secureCodeRepository.delete(secureCodeEntity);
    return { access_token: this.jwtService.sign(payload) }
  }

}
