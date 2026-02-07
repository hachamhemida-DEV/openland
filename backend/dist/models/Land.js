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
exports.Land = exports.LandStatus = exports.ServiceType = exports.LandType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const LandMedia_1 = require("./LandMedia");
const Document_1 = require("./Document");
var LandType;
(function (LandType) {
    LandType["PRIVATE"] = "private";
    LandType["AGRICULTURAL"] = "agricultural";
    LandType["WAQF"] = "waqf";
    LandType["CONCESSION"] = "concession";
})(LandType || (exports.LandType = LandType = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["SALE"] = "sale";
    ServiceType["RENT"] = "rent";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var LandStatus;
(function (LandStatus) {
    LandStatus["PENDING"] = "pending";
    LandStatus["VERIFIED"] = "verified";
    LandStatus["REJECTED"] = "rejected";
    LandStatus["SOLD"] = "sold";
})(LandStatus || (exports.LandStatus = LandStatus = {}));
let Land = class Land extends sequelize_typescript_1.Model {
};
exports.Land = Land;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Land.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Land.prototype, "owner_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Land.prototype, "owner", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Land.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Land.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Land.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Land.prototype, "area_m2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(LandType)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Land.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(ServiceType)),
        allowNull: false,
        defaultValue: ServiceType.SALE,
    }),
    __metadata("design:type", String)
], Land.prototype, "service_type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Land.prototype, "wilaya", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Land.prototype, "baladia", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Land.prototype, "contact_phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Land.prototype, "contact_email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.GEOMETRY('POINT', 4326),
        allowNull: true,
    }),
    __metadata("design:type", Object)
], Land.prototype, "geom", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(LandStatus)),
        defaultValue: LandStatus.PENDING,
    }),
    __metadata("design:type", String)
], Land.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Land.prototype, "rejection_reason", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => LandMedia_1.LandMedia),
    __metadata("design:type", Array)
], Land.prototype, "media", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Document_1.Document),
    __metadata("design:type", Array)
], Land.prototype, "documents", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Land.prototype, "created_at", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Land.prototype, "updated_at", void 0);
exports.Land = Land = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'lands',
        timestamps: true,
    })
], Land);
