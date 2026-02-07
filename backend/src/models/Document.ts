import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Land } from './Land';

export enum DocumentType {
    OWNERSHIP_DEED = 'ownership_deed',
    CADASTRE_PLAN = 'cadastre_plan',
    OTHER = 'other',
}

@Table({
    tableName: 'documents',
    timestamps: true,
})
export class Document extends Model {
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
        type: DataType.ENUM(...Object.values(DocumentType)),
        allowNull: false,
    })
    doc_type!: DocumentType;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_verified!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    verified_at!: Date;
}
