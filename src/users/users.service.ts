import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private usersRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const withData = {
      level: 1,
      totalExperience: 0,
      rank: 1,
      balance: 1000,
      ...dto,
    };
    return await this.usersRepository.create(withData);
  }

  async getAllUsers() {
    return await this.usersRepository.findAll();
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async putUserExperience(token: string, points: number) {
    const data = await this.jwtService.verify(token);
    if (!data) {
      throw new UnauthorizedException();
    }

    const user = await this.getUserByEmail(data.email);
    await this.usersRepository.update(
      {
        totalExperience: user.totalExperience + points,
      },
      { where: { email: data.email } },
    );
    return await this.getUserData(data.email);
  }

  async getUserData(email: string) {
    const user = await this.getUserByEmail(email);

    return {
      data: {
        level: Math.floor(user.totalExperience / 50),
        balance: user.balance,
        totalExperience: user.totalExperience,
        rank: user.rank,
      },
    };
  }

  async getUserRank(email: string) {
    const users = await this.getAllUsers();

    const sorted = users.sort((p, n) => n.totalExperience - p.totalExperience);

    return sorted.findIndex((user) => user.email === email) + 1;
  }

  async getUserBadges(token: string) {
    const data = await this.jwtService.verify(token);
    if (!data) {
      throw new UnauthorizedException();
    }
    const user = await this.getUserByEmail(data.email);
  }

  async getUsersLeaderboard() {
    const users = await this.getAllUsers();
    console.log(users);
    return users
      .sort((f, s) => s.totalExperience - f.totalExperience)
      .map((user) => ({
        name: user.name,
        totalExperience: user.totalExperience,
      }));
  }
}
