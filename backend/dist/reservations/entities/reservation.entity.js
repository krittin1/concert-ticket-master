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
exports.Reservation = exports.ReservationStatus = void 0;
const typeorm_1 = require("typeorm");
const concert_entity_1 = require("../../concerts/entities/concert.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["ACTIVE"] = "active";
    ReservationStatus["CANCELLED"] = "cancelled";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
let Reservation = class Reservation {
    id;
    userId;
    concertId;
    status;
    createdAt;
    user;
    concert;
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Reservation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Reservation.prototype, "concertId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        default: ReservationStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Reservation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => concert_entity_1.Concert, (concert) => concert.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'concertId' }),
    __metadata("design:type", concert_entity_1.Concert)
], Reservation.prototype, "concert", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)('reservations')
], Reservation);
//# sourceMappingURL=reservation.entity.js.map