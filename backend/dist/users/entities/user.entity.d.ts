import { Reservation } from '../../reservations/entities/reservation.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
    createdAt: Date;
    reservations: Reservation[];
}
