"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationRequest = exports.ConsultationStatus = exports.ConsultationType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
var ConsultationType;
(function (ConsultationType) {
    ConsultationType["LEGAL"] = "legal";
    ConsultationType["AGRICULTURAL"] = "agricultural";
})(ConsultationType || (exports.ConsultationType = ConsultationType = {}));
var ConsultationStatus;
(function (ConsultationStatus) {
    ConsultationStatus["PENDING"] = "pending";
    ConsultationStatus["IN_PROGRESS"] = "in_progress";
    ConsultationStatus["COMPLETED"] = "completed";
    ConsultationStatus["CANCELLED"] = "cancelled";
})(ConsultationStatus || (exports.ConsultationStatus = ConsultationStatus = {}));
let ConsultationRequest = class ConsultationRequest extends sequelize_typescript_1.Model {
};
exports.ConsultationRequest = ConsultationRequest;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], ConsultationRequest.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ConsultationRequest.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConsultationType)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConsultationRequest.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConsultationRequest.prototype, "subject", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ConsultationRequest.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConsultationStatus)),
        defaultValue: ConsultationStatus.PENDING,
    }),
    __metadata("design:type", String)
], ConsultationRequest.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ConsultationRequest.prototype, "admin_response", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], ConsultationRequest.prototype, "user", void 0);
exports.ConsultationRequest = ConsultationRequest = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'consultation_requests',
        timestamps: true,
        underscored: true,
    })
], ConsultationRequest);
