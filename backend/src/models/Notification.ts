import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './User';
import { Land } from './Land';

export enum NotificationType {
    NEW_MATCH = 'new_match',
    MESSAGE = 'message',
    LAND_VERIFIED = 'land_verified',
    LAND_REJECTED = 'land_rejected',
    CONSULTATION_RESPONSE = 'consultation_response',
}

@Table({
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
})
export class Notification extends Model {
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

    @Column({
        type: DataType.ENUM(...Object.values(NotificationType)),
        allowNull: false,
    })
    type!: NotificationType;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    message!: string;

    @ForeignKey(() => Land)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    related_land_id?: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_read!: boolean;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Land)
    related_land?: Land;
}
