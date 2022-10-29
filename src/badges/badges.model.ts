import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IBadge {
  name: string;

  title: string;

  badgeColor: string;

  borderColor: string;

  iconBackground: string;

  bronze: bigint;

  silver: bigint;

  gold: bigint;
  description: string;
  icon: string;
}

@Table({ tableName: 'badges' })
export class Badge extends Model<Badge, IBadge> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  badgeColor: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  borderColor: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  iconBackground: string;

  @Column({ type: DataType.BIGINT, unique: false, allowNull: false })
  bronze: bigint;

  @Column({ type: DataType.BIGINT, unique: false, allowNull: false })
  silver: bigint;

  @Column({ type: DataType.BIGINT, unique: false, allowNull: false })
  gold: bigint;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  icon: string;
}
