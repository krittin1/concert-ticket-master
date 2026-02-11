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
exports.Concert = void 0;
const typeorm_1 = require("typeorm");
const reservation_entity_1 = require("../../reservations/entities/reservation.entity");
let Concert = class Concert {
    id;
    name;
    description;
    totalSeats;
    reservedSeats;
    createdAt;
    updatedAt;
    reservations;
    get availableSeats() {
        return this.totalSeats - this.reservedSeats;
    }
    get isFullyBooked() {
        return this.reservedSeats >= this.totalSeats;
    }
};
exports.Concert = Concert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Concert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Concert.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Concert.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Concert.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Concert.prototype, "reservedSeats", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Concert.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Concert.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reservation_entity_1.Reservation, (reservation) => reservation.concert, { cascade: true }),
    __metadata("design:type", Array)
], Concert.prototype, "reservations", void 0);
exports.Concert = Concert = __decorate([
    (0, typeorm_1.Entity)('concerts')
], Concert);
//# sourceMappingURL=concert.entity.js.map