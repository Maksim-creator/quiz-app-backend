import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private usersRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    return await this.usersRepository.create(dto);
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
}
