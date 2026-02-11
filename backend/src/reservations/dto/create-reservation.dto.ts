import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateReservationDto {
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsPositive({ message: 'User ID must be a positive number' })
  userId: number;

  @IsNumber({}, { message: 'Concert ID must be a number' })
  @IsNotEmpty({ message: 'Concert ID is required' })
  @IsPositive({ message: 'Concert ID must be a positive number' })
  concertId: number;
}
