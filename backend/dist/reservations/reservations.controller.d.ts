import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
    findByUser(userId: number): Promise<Reservation[]>;
    cancel(id: number, userId: number): Promise<Reservation>;
}
