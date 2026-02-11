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
exports.ConcertsController = void 0;
const common_1 = require("@nestjs/common");
const concerts_service_1 = require("./concerts.service");
const create_concert_dto_1 = require("./dto/create-concert.dto");
let ConcertsController = class ConcertsController {
    concertsService;
    constructor(concertsService) {
        this.concertsService = concertsService;
    }
    async create(createConcertDto) {
        return await this.concertsService.create(createConcertDto);
    }
    async findAll() {
        return await this.concertsService.findAll();
    }
    async findOne(id) {
        return await this.concertsService.findOne(id);
    }
    async remove(id) {
        await this.concertsService.remove(id);
        return { message: 'Concert deleted successfully' };
    }
};
exports.ConcertsController = ConcertsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_concert_dto_1.CreateConcertDto]),
    __metadata("design:returntype", Promise)
], ConcertsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConcertsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConcertsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConcertsController.prototype, "remove", null);
exports.ConcertsController = ConcertsController = __decorate([
    (0, common_1.Controller)('concerts'),
    __metadata("design:paramtypes", [concerts_service_1.ConcertsService])
], ConcertsController);
//# sourceMappingURL=concerts.controller.js.map