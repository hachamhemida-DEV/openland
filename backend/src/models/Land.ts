import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { User } from './User';
import { LandMedia } from './LandMedia';
import { Document } from './Document';

export enum LandType {
    PRIVATE = 'private',
    AGRICULTURAL = 'agricultural',
    WAQF = 'waqf',
    CONCESSION = 'concession',
}

export enum ServiceType {
    SALE = 'sale',
    RENT = 'rent',
}

export enum LandStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
    SOLD = 'sold',
}

@Table({
    tableName: 'lands',
    timestamps: true,
})
export class Land extends Model {
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
    owner_id!: number;

    @BelongsTo(() => User)
    owner!: User;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.DECIMAL(15, 2),
        allowNull: false,
    })
    price!: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    area_m2!: number;

    @Column({
        type: DataType.ENUM(...Object.values(LandType)),
        allowNull: false,
    })
    type!: LandType;

    @Column({
        type: DataType.ENUM(...Object.values(ServiceType)),
        allowNull: false,
        defaultValue: ServiceType.SALE,
    })
    service_type!: ServiceType;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    wilaya!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    baladia!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    contact_phone?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    contact_email?: string;

    @Column({
        type: DataType.GEOMETRY('POINT', 4326),
        allowNull: true,
    })
    geom!: any;

    @Column({
        type: DataType.ENUM(...Object.values(LandStatus)),
        defaultValue: LandStatus.PENDING,
    })
    status!: LandStatus;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    rejection_reason?: string;

    @HasMany(() => LandMedia)
    media!: LandMedia[];

    @HasMany(() => Document)
    documents!: Document[];

    @CreatedAt
    created_at!: Date;

    @UpdatedAt
    updated_at!: Date;
}
