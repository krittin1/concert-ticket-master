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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const concerts_service_1 = require("../concerts/concerts.service");
let ReservationsService = class ReservationsService {
    reservationsRepository;
    concertsService;
    constructor(reservationsRepository, concertsService) {
        this.reservationsRepository = reservationsRepository;
        this.concertsService = concertsService;
    }
    async create(createReservationDto) {
        const { userId, concertId } = createReservationDto;
        const concert = await this.concertsService.findOne(concertId);
        if (concert.isFullyBooked) {
            throw new common_1.BadRequestException('Concert is fully booked');
        }
        const existingReservation = await this.reservationsRepository.findOne({
            where: {
                userId,
                concertId,
                status: reservation_entity_1.ReservationStatus.ACTIVE,
            },
        });
        if (existingReservation) {
            throw new common_1.ConflictException('User already has a reservation for this concert');
        }
        const reservation = this.reservationsRepository.create({
            userId,
            concertId,
            status: reservation_entity_1.ReservationStatus.ACTIVE,
        });
        const savedReservation = await this.reservationsRepository.save(reservation);
        await this.concertsService.incrementReservedSeats(concertId);
        const result = await this.reservationsRepository.findOne({
            where: { id: savedReservation.id },
            relations: ['concert', 'user'],
        });
        if (!result) {
            throw new common_1.NotFoundException('Reservation not found after creation');
        }
        return result;
    }
    async findAll() {
        return await this.reservationsRepository.find({
            relations: ['concert', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        return await this.reservationsRepository.find({
            where: { userId },
            relations: ['concert'],
            order: { createdAt: 'DESC' },
        });
    }
    async cancel(id, userId) {
        const reservation = await this.reservationsRepository.findOne({
            where: { id },
            relations: ['concert'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException(`Reservation with ID ${id} not found`);
        }
        if (reservation.userId !== userId) {
            throw new common_1.BadRequestException('You can only cancel your own reservations');
        }
        if (reservation.status === reservation_entity_1.ReservationStatus.CANCELLED) {
            throw new common_1.BadRequestException('Reservation is already cancelled');
        }
        reservation.status = reservation_entity_1.ReservationStatus.CANCELLED;
        await this.reservationsRepository.save(reservation);
        await this.concertsService.decrementReservedSeats(reservation.concertId);
        return reservation;
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        concerts_service_1.ConcertsService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map