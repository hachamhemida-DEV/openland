import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt } from 'sequelize-typescript';
import { User } from './User';
import { Land } from './Land';

@Table({
    tableName: 'inquiries',
    timestamps: true,
})
export class Inquiry extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @ForeignKey(() => Land)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    land_id!: number;

    @BelongsTo(() => Land)
    land!: Land;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: number;

    @BelongsTo(() => User)
    user!: User;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    message!: string;

    @Column({
        type: DataType.STRING,
        defaultValue: 'pending', // pending, replied, closed
    })
    status!: string;

    @CreatedAt
    created_at!: Date;
}
