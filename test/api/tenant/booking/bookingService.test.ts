import BookingService from '../../../../src/services/tenant/bookingService';
import BookingFactory from '../../../../src/factories/tenant/bookingFactory';
import { Request } from 'express';

// Mock dependencies
jest.mock('../../../../src/factories/tenant/bookingFactory');

describe('BookingService', () => {
  let req: Partial<Request>;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };

    // Mocking the database connection
    (req as any).knex = {};

    // Setup mock for getBookingDetails to return a valid booking object
    const mockedBookingFactory = new BookingFactory((req as any).knex);
    mockedBookingFactory.getBookingDetails = jest.fn().mockResolvedValue({
      id: 'booking1',
      status: 'pending'
    });
    // Replace the actual BookingFactory with the mocked one
    (BookingService as any).bookingFactory = mockedBookingFactory;
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      req.body = { /* populate with necessary data */ };
      (req as any).userInfo = { id: 'user1', type: 'admin' };
      (req as any).knex = {}; // Mocked DB connection
      await expect(BookingService.createBooking(req as Request)).resolves.not.toThrow();
    });
  });

  describe('updateBooking', () => {
    it('should update a booking successfully', async () => {
      req.params = { id: 'booking1' };
      req.body = {
        time: '2:00 PM', // Correct format
        // other necessary fields...
      };
      await expect(BookingService.updateBooking(req as Request)).resolves.not.toThrow();
    });
  });

  describe('getBookingDetails', () => {
    it('should retrieve booking details successfully', async () => {
      req.params = { id: 'booking1' };
      (req as any).knex = {}; // Mocked DB connection
      await expect(BookingService.getBookingDetails(req as Request)).resolves.not.toThrow();
    });
  });

  describe('listBookings', () => {
    it('should list bookings successfully', async () => {
      req.query = { page: '1', limit: '10' };
      (req as any).knex = {}; // Mocked DB connection
      await expect(BookingService.listBookings(req as Request)).resolves.not.toThrow();
    });
  });

  describe('updateBookingStatus', () => {
    it('should update the status of a booking successfully', async () => {
      req.params = { id: 'booking1' };
      req.body = { status: 'completed' };
      await expect(BookingService.updateBookingStatus(req as Request)).resolves.not.toThrow();
    });
  });
});
