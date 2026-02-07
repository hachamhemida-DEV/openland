import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './User';
import { Land } from './Land';

@Table({
    tableName: 'messages',
    timestamps: true,
    underscored: true,
})
export class Message extends Model {
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
    sender_id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    receiver_id!: number;

    @ForeignKey(() => Land)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    land_id?: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    content!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_read!: boolean;

    @BelongsTo(() => User, 'sender_id')
    sender!: User;

    @BelongsTo(() => User, 'receiver_id')
    receiver!: User;

    @BelongsTo(() => Land)
    land?: Land;
}
