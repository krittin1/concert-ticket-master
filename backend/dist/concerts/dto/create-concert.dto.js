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
exports.CreateConcertDto = void 0;
const class_validator_1 = require("class-validator");
class CreateConcertDto {
    name;
    description;
    totalSeats;
}
exports.CreateConcertDto = CreateConcertDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Concert name must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Concert name is required' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Concert name must not exceed 200 characters' }),
    __metadata("design:type", String)
], CreateConcertDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Description must not exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateConcertDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Total seats must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Total seats must be at least 1' }),
    __metadata("design:type", Number)
], CreateConcertDto.prototype, "totalSeats", void 0);
//# sourceMappingURL=create-concert.dto.js.map