import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user', description: 'Username' })
  readonly name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  readonly password: string;
}
