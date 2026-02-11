import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationsService } from './reservations.service';
import { Reservation } from './entities/reservation.entity';
import { ConcertsService } from '../concerts/concerts.service';
import { BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: Repository<Reservation>;
  let concertsService: ConcertsService;

  const mockReservationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockConcertsService = {
    findOne: jest.fn(),
    incrementReservedSeats: jest.fn(),
    decrementReservedSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
        {
          provide: ConcertsService,
          useValue: mockConcertsService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    );
    concertsService = module.get<ConcertsService>(ConcertsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a reservation successfully', async () => {
      const createReservationDto = { userId: 1, concertId: 1 };
      const concert = {
        id: 1,
        totalSeats: 100,
        reservedSeats: 50,
        isFullyBooked: false,
      };
      const reservation = {
        id: 1,
        ...createReservationDto,
        status: 'active',
      };

      mockConcertsService.findOne.mockResolvedValue(concert);
      mockReservationRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(reservation);
      mockReservationRepository.create.mockReturnValue(reservation);
      mockReservationRepository.save.mockResolvedValue(reservation);

      const result = await service.create(createReservationDto);

      expect(result).toEqual(reservation);
      expect(mockConcertsService.incrementReservedSeats).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException when concert is fully booked', async () => {
      const createReservationDto = { userId: 1, concertId: 1 };
      const concert = {
        id: 1,
        totalSeats: 100,
        reservedSeats: 100,
        isFullyBooked: true,
      };

      mockConcertsService.findOne.mockResolvedValue(concert);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockReservationRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when user already has a reservation', async () => {
      const createReservationDto = { userId: 1, concertId: 1 };
      const concert = {
        id: 1,
        totalSeats: 100,
        reservedSeats: 50,
        isFullyBooked: false,
      };
      const existingReservation = {
        id: 1,
        userId: 1,
        concertId: 1,
        status: 'active',
      };

      mockConcertsService.findOne.mockResolvedValue(concert);
      mockReservationRepository.findOne.mockResolvedValue(existingReservation);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockReservationRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all reservations with relations', async () => {
      const reservations = [
        { id: 1, userId: 1, concertId: 1, status: 'active' },
        { id: 2, userId: 2, concertId: 1, status: 'active' },
      ];

      mockReservationRepository.find.mockResolvedValue(reservations);

      const result = await service.findAll();

      expect(result).toEqual(reservations);
      expect(mockReservationRepository.find).toHaveBeenCalledWith({
        relations: ['concert', 'user'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByUser', () => {
    it('should return reservations for a specific user', async () => {
      const reservations = [
        { id: 1, userId: 1, concertId: 1, status: 'active' },
        { id: 2, userId: 1, concertId: 2, status: 'cancelled' },
      ];

      mockReservationRepository.find.mockResolvedValue(reservations);

      const result = await service.findByUser(1);

      expect(result).toEqual(reservations);
      expect(mockReservationRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['concert'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation successfully', async () => {
      const reservation = {
        id: 1,
        userId: 1,
        concertId: 1,
        status: 'active',
      };
      const updatedReservation = { ...reservation, status: 'cancelled' };

      mockReservationRepository.findOne.mockResolvedValue(reservation);
      mockReservationRepository.save.mockResolvedValue(updatedReservation);

      const result = await service.cancel(1, 1);

      expect(result.status).toBe('cancelled');
      expect(mockConcertsService.decrementReservedSeats).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(service.cancel(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user is not the owner', async () => {
      const reservation = {
        id: 1,
        userId: 1,
        concertId: 1,
        status: 'active',
      };

      mockReservationRepository.findOne.mockResolvedValue(reservation);

      await expect(service.cancel(1, 2)).rejects.toThrow(BadRequestException);
      expect(mockReservationRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when reservation is already cancelled', async () => {
      const reservation = {
        id: 1,
        userId: 1,
        concertId: 1,
        status: 'cancelled',
      };

      mockReservationRepository.findOne.mockResolvedValue(reservation);

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
      expect(mockReservationRepository.save).not.toHaveBeenCalled();
    });
  });
});
