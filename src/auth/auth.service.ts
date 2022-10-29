import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/users.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const isPasswordEqual = await bcryptjs.compare(dto.password, user.password);

    if (!isPasswordEqual) {
      throw new UnauthorizedException({ message: 'Invalid password' });
    }

    const token = await this.generateToken(user);
    const rank = await this.userService.getUserRank(user.email);
    return {
      email: user.email,
      name: user.name,
      token,
      data: {
        level: Math.floor(user.totalExperience / 50),
        totalExperience: user.totalExperience,
        rank,
        balance: user.balance,
      },
    };
  }

  async registration(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user) {
      throw new HttpException(
        'User with this email has already registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcryptjs.hash(dto.password, 5);
    const newUser = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    const token = await this.generateToken(newUser);
    const rank = await this.userService.getUserRank(newUser.email);
    return {
      token,
      email: newUser.email,
      name: newUser.name,
      data: {
        level: Math.floor(newUser.totalExperience / 50),
        totalExperience: newUser.totalExperience,
        rank,
        balance: newUser.balance,
      },
    };
  }

  async generateToken(user: User) {
    const payload = {
      email: user.email,
      password: user.password,
    };
    return this.jwtService.sign(payload);
  }
}
