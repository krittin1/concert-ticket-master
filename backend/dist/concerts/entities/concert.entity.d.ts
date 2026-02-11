import { Reservation } from '../../reservations/entities/reservation.entity';
export declare class Concert {
    id: number;
    name: string;
    description: string;
    totalSeats: number;
    reservedSeats: number;
    createdAt: Date;
    updatedAt: Date;
    reservations: Reservation[];
    get availableSeats(): number;
    get isFullyBooked(): boolean;
}
