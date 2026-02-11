import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entities/concert.entity';
export declare class ConcertsController {
    private readonly concertsService;
    constructor(concertsService: ConcertsService);
    create(createConcertDto: CreateConcertDto): Promise<Concert>;
    findAll(): Promise<Concert[]>;
    findOne(id: number): Promise<Concert>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
