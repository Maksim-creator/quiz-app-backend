import { Body, Controller, Get, Post, Put, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'User creation' })
  @ApiResponse({ type: User, status: 200 })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: [User], status: 200 })
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'User data update' })
  @ApiResponse({ type: User, status: 200 })
  @Put('/updatePoints')
  async putExperience(
    @Body() { points }: { points: number },
    @Request() req: any,
  ) {
    return this.usersService.putUserExperience(
      req.headers.authorization,
      points,
    );
  }

  @Post('/user')
  async getUser(@Body() { email }: { email: string }) {
    return this.usersService.getUserData(email);
  }

  @Get('/userBadges')
  async getBadges(@Request() req: any) {
    return this.usersService.getUserBadges(req.headers.authorization);
  }

  @Get('/leaderboard')
  async getLeaderboard() {
    return this.usersService.getUsersLeaderboard();
  }
}
