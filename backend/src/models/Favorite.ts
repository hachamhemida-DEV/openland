import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './User';
import { Land } from './Land';

@Table({
    tableName: 'favorites',
    timestamps: true,
    underscored: true,
})
export class Favorite extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: number;

    @ForeignKey(() => Land)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    land_id!: number;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Land)
    land!: Land;
}
