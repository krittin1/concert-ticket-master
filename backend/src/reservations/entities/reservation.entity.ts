import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Concert } from '../../concerts/entities/concert.entity';
import { User } from '../../users/entities/user.entity';

export enum ReservationStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  concertId: number;

  @Column({
    type: 'text',
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Concert, (concert) => concert.reservations)
  @JoinColumn({ name: 'concertId' })
  concert: Concert;
}
