import { Repository } from 'typeorm';
import { Concert } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Reservation } from '../reservations/entities/reservation.entity';
export declare class ConcertsService {
    private concertsRepository;
    private reservationsRepository;
    constructor(concertsRepository: Repository<Concert>, reservationsRepository: Repository<Reservation>);
    create(createConcertDto: CreateConcertDto): Promise<Concert>;
    findAll(): Promise<Concert[]>;
    findOne(id: number): Promise<Concert>;
    remove(id: number): Promise<void>;
    incrementReservedSeats(id: number): Promise<void>;
    decrementReservedSeats(id: number): Promise<void>;
}
