import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from './User';

export enum ConsultationType {
    LEGAL = 'legal',
    AGRICULTURAL = 'agricultural',
}

export enum ConsultationStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Table({
    tableName: 'consultation_requests',
    timestamps: true,
    underscored: true,
})
export class ConsultationRequest extends Model {
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
        type: DataType.ENUM(...Object.values(ConsultationType)),
        allowNull: false,
    })
    type!: ConsultationType;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    subject!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.ENUM(...Object.values(ConsultationStatus)),
        defaultValue: ConsultationStatus.PENDING,
    })
    status!: ConsultationStatus;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    admin_response?: string;

    @BelongsTo(() => User)
    user!: User;
}
