import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Reservation])],
  controllers: [ConcertsController],
  providers: [ConcertsService],
  exports: [ConcertsService],
})
export class ConcertsModule {}
