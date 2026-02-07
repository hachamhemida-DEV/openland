import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './User';
import { LandType } from './Land';

@Table({
    tableName: 'user_preferences',
    timestamps: true,
    underscored: true,
})
export class UserPreference extends Model {
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
        unique: true,
    })
    user_id!: number;

    @Column({
        type: DataType.JSON,
        allowNull: true,
    })
    preferred_types?: string[];

    @Column({
        type: DataType.JSON,
        allowNull: true,
    })
    preferred_wilayas?: string[];

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    min_price?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    max_price?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    min_area?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    max_area?: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    notify_on_match!: boolean;

    @BelongsTo(() => User)
    user!: User;
}
