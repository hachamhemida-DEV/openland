import { Table, Column, Model, DataType, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Land } from './Land';
import { Inquiry } from './Inquiry';

export enum UserRole {
    ADMIN = 'admin',
    BUYER = 'buyer',
    SELLER = 'seller',
    VISITOR = 'visitor',
}

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password_hash!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    full_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    phone!: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.VISITOR,
    })
    role!: UserRole;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_verified!: boolean;

    @HasMany(() => Land)
    lands!: Land[];

    @HasMany(() => Inquiry)
    inquiries!: Inquiry[];

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;
}
