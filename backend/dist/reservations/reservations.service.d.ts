import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ConcertsService } from '../concerts/concerts.service';
export declare class ReservationsService {
    private reservationsRepository;
    private concertsService;
    constructor(reservationsRepository: Repository<Reservation>, concertsService: ConcertsService);
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
    findByUser(userId: number): Promise<Reservation[]>;
    cancel(id: number, userId: number): Promise<Reservation>;
}
