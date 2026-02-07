import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Land } from './Land';

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
}

@Table({
    tableName: 'land_media',
    timestamps: true,
})
export class LandMedia extends Model {
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    url!: string;

    @Column({
        type: DataType.ENUM(...Object.values(MediaType)),
        defaultValue: MediaType.IMAGE,
    })
    media_type!: MediaType;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    order!: number;
}
