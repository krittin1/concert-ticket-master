import { Concert } from '../../concerts/entities/concert.entity';
import { User } from '../../users/entities/user.entity';
export declare enum ReservationStatus {
    ACTIVE = "active",
    CANCELLED = "cancelled"
}
export declare class Reservation {
    id: number;
    userId: number;
    concertId: number;
    status: ReservationStatus;
    createdAt: Date;
    user: User;
    concert: Concert;
}
