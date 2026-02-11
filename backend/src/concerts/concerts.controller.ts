import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entities/concert.entity';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  async create(@Body(ValidationPipe) createConcertDto: CreateConcertDto): Promise<Concert> {
    return await this.concertsService.create(createConcertDto);
  }

  @Get()
  async findAll(): Promise<Concert[]> {
    return await this.concertsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Concert> {
    return await this.concertsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.concertsService.remove(id);
    return { message: 'Concert deleted successfully' };
  }
}
