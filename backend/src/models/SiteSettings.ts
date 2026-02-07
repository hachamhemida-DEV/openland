import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'site_settings',
    timestamps: true,
})
export class SiteSettings extends Model {
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
    })
    key!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    value!: string;
}
