import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConcertsService } from '../concerts/concerts.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private concertsService: ConcertsService,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { userId, concertId } = createReservationDto;

    // Check if concert exists
    const concert = await this.concertsService.findOne(concertId);

    // Check if concert is fully booked
    if (concert.isFullyBooked) {
      throw new BadRequestException('Concert is fully booked');
    }

    // Check if user already has an active reservation for this concert
    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        userId,
        concertId,
        status: ReservationStatus.ACTIVE,
      },
    });

    if (existingReservation) {
      throw new ConflictException('User already has a reservation for this concert');
    }

    // Create reservation
    const reservation = this.reservationsRepository.create({
      userId,
      concertId,
      status: ReservationStatus.ACTIVE,
    });

    const savedReservation = await this.reservationsRepository.save(reservation);

    // Increment reserved seats
    await this.concertsService.incrementReservedSeats(concertId);

    const result = await this.reservationsRepository.findOne({
      where: { id: savedReservation.id },
      relations: ['concert', 'user'],
    });

    if (!result) {
      throw new NotFoundException('Reservation not found after creation');
    }

    return result;
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationsRepository.find({
      relations: ['concert', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    return await this.reservationsRepository.find({
      where: { userId },
      relations: ['concert'],
      order: { createdAt: 'DESC' },
    });
  }

  async cancel(id: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['concert'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    if (reservation.userId !== userId) {
      throw new BadRequestException('You can only cancel your own reservations');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('Reservation is already cancelled');
    }

    reservation.status = ReservationStatus.CANCELLED;
    await this.reservationsRepository.save(reservation);

    // Decrement reserved seats
    await this.concertsService.decrementReservedSeats(reservation.concertId);

    return reservation;
  }
}
