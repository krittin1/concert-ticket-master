import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertsService } from './concerts.service';
import { Concert } from './entities/concert.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertRepository: Repository<Concert>;
  let reservationRepository: Repository<Reservation>;

  const mockConcertRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
  };

  const mockReservationRepository = {
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: getRepositoryToken(Concert),
          useValue: mockConcertRepository,
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    concertRepository = module.get<Repository<Concert>>(getRepositoryToken(Concert));
    reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new concert', async () => {
      const createConcertDto = {
        name: 'Rock Festival',
        description: 'Amazing rock music',
        totalSeats: 100,
      };

      const concert = { id: 1, ...createConcertDto, reservedSeats: 0 };

      mockConcertRepository.create.mockReturnValue(concert);
      mockConcertRepository.save.mockResolvedValue(concert);

      const result = await service.create(createConcertDto);

      expect(result).toEqual(concert);
      expect(mockConcertRepository.create).toHaveBeenCalledWith(createConcertDto);
      expect(mockConcertRepository.save).toHaveBeenCalledWith(concert);
    });
  });

  describe('findAll', () => {
    it('should return an array of concerts', async () => {
      const concerts = [
        { id: 1, name: 'Concert 1', totalSeats: 100, reservedSeats: 10 },
        { id: 2, name: 'Concert 2', totalSeats: 200, reservedSeats: 20 },
      ];

      mockConcertRepository.find.mockResolvedValue(concerts);

      const result = await service.findAll();

      expect(result).toEqual(concerts);
      expect(mockConcertRepository.find).toHaveBeenCalledWith({
        relations: ['reservations'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a concert by id', async () => {
      const concert = { id: 1, name: 'Concert 1', totalSeats: 100 };

      mockConcertRepository.findOne.mockResolvedValue(concert);

      const result = await service.findOne(1);

      expect(result).toEqual(concert);
      expect(mockConcertRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['reservations'],
      });
    });

    it('should throw NotFoundException when concert not found', async () => {
      mockConcertRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a concert with no active reservations', async () => {
      const concert = {
        id: 1,
        name: 'Concert 1',
        reservations: [
          { id: 1, status: 'cancelled' },
          { id: 2, status: 'cancelled' },
        ],
      };

      mockConcertRepository.findOne.mockResolvedValue(concert);
      mockReservationRepository.remove.mockResolvedValue(concert.reservations);
      mockConcertRepository.remove.mockResolvedValue(concert);

      await service.remove(1);

      expect(mockReservationRepository.remove).toHaveBeenCalledWith(concert.reservations);
      expect(mockConcertRepository.remove).toHaveBeenCalledWith(concert);
    });

    it('should throw BadRequestException when concert has active reservations', async () => {
      const concert = {
        id: 1,
        name: 'Concert 1',
        reservations: [
          { id: 1, status: 'active' },
          { id: 2, status: 'cancelled' },
        ],
      };

      mockConcertRepository.findOne.mockResolvedValue(concert);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      expect(mockConcertRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle concert with no reservations', async () => {
      const concert = {
        id: 1,
        name: 'Concert 1',
        reservations: [],
      };

      mockConcertRepository.findOne.mockResolvedValue(concert);
      mockConcertRepository.remove.mockResolvedValue(concert);

      await service.remove(1);

      expect(mockReservationRepository.remove).not.toHaveBeenCalled();
      expect(mockConcertRepository.remove).toHaveBeenCalledWith(concert);
    });
  });

  describe('incrementReservedSeats', () => {
    it('should increment reserved seats by 1', async () => {
      await service.incrementReservedSeats(1);

      expect(mockConcertRepository.increment).toHaveBeenCalledWith(
        { id: 1 },
        'reservedSeats',
        1,
      );
    });
  });

  describe('decrementReservedSeats', () => {
    it('should decrement reserved seats by 1', async () => {
      await service.decrementReservedSeats(1);

      expect(mockConcertRepository.decrement).toHaveBeenCalledWith(
        { id: 1 },
        'reservedSeats',
        1,
      );
    });
  });
});
