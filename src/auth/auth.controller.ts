import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { SecureCodeDto } from './dto/secure-code.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("signup")
  create(@Body() userDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("currentUser")
  getCurrentUser(@Request() req) {
    return req.user;
  }

  @Post("token/verifyCode")
  verifyUsingSecureCode(@Body() secureCodeDto: SecureCodeDto) {
    return this.authService.verifySecureCode(secureCodeDto)
  }

}
