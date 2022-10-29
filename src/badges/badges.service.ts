import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { JwtService } from '@nestjs/jwt';
import { Badge } from './badges.model';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class BadgesService {
  constructor(
    @InjectModel(User) private usersRepository: typeof User,
    private userService: UsersService,
    @InjectModel(Badge) private badgesRepository: typeof Badge,
    private jwtService: JwtService,
  ) {}

  async getUserBadges(token: string): Promise<any> {
    console.log(token);
    const data = await this.jwtService.verify(token);
    const badges = await this.badgesRepository.findAll();
    if (!data || !badges) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUserByEmail(data.email);

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    return badges;
  }

  async postNewBadges(badges: CreateBadgeDto[]) {
    return await this.badgesRepository.create(badges);
  }
}
