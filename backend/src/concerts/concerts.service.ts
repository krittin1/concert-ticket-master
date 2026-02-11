import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertsRepository: Repository<Concert>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async create(createConcertDto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertsRepository.create(createConcertDto);
    return await this.concertsRepository.save(concert);
  }

  async findAll(): Promise<Concert[]> {
    return await this.concertsRepository.find({
      relations: ['reservations'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Concert> {
    const concert = await this.concertsRepository.findOne({
      where: { id },
      relations: ['reservations'],
    });

    if (!concert) {
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }

    return concert;
  }

  async remove(id: number): Promise<void> {
    const concert = await this.findOne(id);
    
    // Check if there are any active reservations
    const activeReservations = concert.reservations?.filter(r => r.status === 'active') || [];
    if (activeReservations.length > 0) {
      throw new BadRequestException('Cannot delete concert with active reservations');
    }

    // Manually delete all reservations (including cancelled ones) first
    if (concert.reservations && concert.reservations.length > 0) {
      await this.reservationsRepository.remove(concert.reservations);
    }

    // Now delete the concert
    await this.concertsRepository.remove(concert);
  }

  async incrementReservedSeats(id: number): Promise<void> {
    await this.concertsRepository.increment({ id }, 'reservedSeats', 1);
  }

  async decrementReservedSeats(id: number): Promise<void> {
    await this.concertsRepository.decrement({ id }, 'reservedSeats', 1);
  }
}
