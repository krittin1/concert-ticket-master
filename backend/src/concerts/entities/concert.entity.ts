import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('concerts')
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  totalSeats: number;

  @Column({ default: 0 })
  reservedSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.concert, { cascade: true })
  reservations: Reservation[];

  get availableSeats(): number {
    return this.totalSeats - this.reservedSeats;
  }

  get isFullyBooked(): boolean {
    return this.reservedSeats >= this.totalSeats;
  }
}
