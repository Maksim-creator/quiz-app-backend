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

    const isPasswordEqual = bcryptjs.compare(dto.password, user.password);

    if (!isPasswordEqual) {
      throw new UnauthorizedException({ message: 'Invalid password' });
    }
    return this.generateToken(user);
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
    return this.generateToken(newUser);
  }

  async generateToken(user: User) {
    const payload = {
      email: user.email,
      password: user.password,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
