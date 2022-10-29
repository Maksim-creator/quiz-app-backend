import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
  role: string;
  level: number;
  totalExperience: number;
  rank: number;
  balance: number;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user', description: 'Username' })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'User email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ description: 'User level' })
  @Column({ type: DataType.INTEGER })
  level: number;

  @ApiProperty({ description: 'User exp' })
  @Column({ type: DataType.INTEGER })
  totalExperience: number;

  @ApiProperty({ description: 'User rank' })
  @Column({ type: DataType.INTEGER })
  rank: number;

  @ApiProperty({ description: 'User balance' })
  @Column({ type: DataType.INTEGER })
  balance: number;
}
