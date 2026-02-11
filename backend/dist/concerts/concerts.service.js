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
exports.ConcertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const concert_entity_1 = require("./entities/concert.entity");
const reservation_entity_1 = require("../reservations/entities/reservation.entity");
let ConcertsService = class ConcertsService {
    concertsRepository;
    reservationsRepository;
    constructor(concertsRepository, reservationsRepository) {
        this.concertsRepository = concertsRepository;
        this.reservationsRepository = reservationsRepository;
    }
    async create(createConcertDto) {
        const concert = this.concertsRepository.create(createConcertDto);
        return await this.concertsRepository.save(concert);
    }
    async findAll() {
        return await this.concertsRepository.find({
            relations: ['reservations'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const concert = await this.concertsRepository.findOne({
            where: { id },
            relations: ['reservations'],
        });
        if (!concert) {
            throw new common_1.NotFoundException(`Concert with ID ${id} not found`);
        }
        return concert;
    }
    async remove(id) {
        const concert = await this.findOne(id);
        const activeReservations = concert.reservations?.filter(r => r.status === 'active') || [];
        if (activeReservations.length > 0) {
            throw new common_1.BadRequestException('Cannot delete concert with active reservations');
        }
        if (concert.reservations && concert.reservations.length > 0) {
            await this.reservationsRepository.remove(concert.reservations);
        }
        await this.concertsRepository.remove(concert);
    }
    async incrementReservedSeats(id) {
        await this.concertsRepository.increment({ id }, 'reservedSeats', 1);
    }
    async decrementReservedSeats(id) {
        await this.concertsRepository.decrement({ id }, 'reservedSeats', 1);
    }
};
exports.ConcertsService = ConcertsService;
exports.ConcertsService = ConcertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(concert_entity_1.Concert)),
    __param(1, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ConcertsService);
//# sourceMappingURL=concerts.service.js.map