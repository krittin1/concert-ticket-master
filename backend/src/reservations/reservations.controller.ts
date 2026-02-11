import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body(ValidationPipe) createReservationDto: CreateReservationDto): Promise<Reservation> {
    return await this.reservationsService.create(createReservationDto);
  }

  @Get()
  async findAll(): Promise<Reservation[]> {
    return await this.reservationsService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Reservation[]> {
    return await this.reservationsService.findByUser(userId);
  }

  @Patch(':id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<Reservation> {
    return await this.reservationsService.cancel(id, userId);
  }
}
