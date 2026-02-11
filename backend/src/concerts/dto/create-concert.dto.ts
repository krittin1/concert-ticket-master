import { IsString, IsNotEmpty, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateConcertDto {
  @IsString({ message: 'Concert name must be a string' })
  @IsNotEmpty({ message: 'Concert name is required' })
  @MaxLength(200, { message: 'Concert name must not exceed 200 characters' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description: string;

  @IsNumber({}, { message: 'Total seats must be a number' })
  @Min(1, { message: 'Total seats must be at least 1' })
  totalSeats: number;
}
