import { Knex } from 'knex';
import BookingModel from '../../../../src/models/tenant/bookingModel';
import model from '../../../../src/models/generelisedModel'
import BookingFactory from '../../../../src/factories/tenant/bookingFactory';
import { BookingMessages, ErrorMessages } from '../../../../src/enums/responseMessages';

// Mock the BookingModel
jest.mock('../../../../src/models/tenant/bookingModel');

describe('BookingFactory', () => {
  let bookingFactory: BookingFactory;
  let mockDb: Knex;
  let mockBookingModel: jest.Mocked<BookingModel>;
  let mockGeneralisedModel: jest.Mocked<model>;

  beforeEach(() => {
    mockDb = {} as Knex; // Mock Knex instance
    mockBookingModel = new BookingModel(mockDb) as jest.Mocked<BookingModel>;
    mockGeneralisedModel = new model(mockDb) as jest.Mocked<model>;
        bookingFactory = new BookingFactory(mockDb);
    (bookingFactory as any).bookingModel = mockBookingModel; // Inject mock BookingModel
    (bookingFactory as any).generalisedModel = mockGeneralisedModel; // Inject mock GeneralisedModel
  });

  describe('createBooking', () => {
    const mockBookingData = {
      customer_id: 'customer123',
      provider_id: 'provider123',
      services_ids: ['service1', 'service2'],
      booking_date: '2023-01-01',
      booking_time: '10:00',
      booking_type: 1,
      created_by: 1,
      created_by_user_type: 1,
    };

    it('should create a new booking successfully', async () => {
      (mockGeneralisedModel.insert as jest.Mock).mockResolvedValue([{ booking_uuid: 'uuid123' } as any]);

      const result = await bookingFactory.createBooking(mockBookingData);

      expect(result).toHaveLength(1);
    });

    it('should throw an error if booking creation fails', async () => {
      (mockGeneralisedModel.insert as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(bookingFactory.createBooking(mockBookingData))
            .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  describe('updateBooking', () => {
    const mockBookingUuid = 'booking123';
    const mockUpdateData = {
      booking_date: '2023-01-02',
      booking_time: '11:00',
    };

    it('should update an existing booking successfully', async () => {
      (mockGeneralisedModel.update as jest.Mock).mockResolvedValue([{ booking_uuid: mockBookingUuid } as any]);

      const result = await (bookingFactory as any).updateBooking(mockBookingUuid, mockUpdateData);

      expect(result).toHaveLength(1);
      expect(result[0].booking_uuid).toBe(mockBookingUuid);
    });

    it('should throw an error if booking is not found', async () => {
      (mockGeneralisedModel.update as jest.Mock).mockResolvedValue([]);

      await expect((bookingFactory as any).updateBooking(mockBookingUuid, mockUpdateData))
                .rejects.toThrow(BookingMessages.BookingNotFound);
    });
  });

  describe('getBookingDetails', () => {
    const mockBookingUuid = 'booking123';

    it('should retrieve booking details successfully', async () => {
      const mockBookingDetails = {
        booking_uuid: mockBookingUuid,
        customer_id: 'customer123',
        provider_id: 'provider123',
      };
      (mockBookingModel.getCompleteBookingDetails as jest.Mock).mockResolvedValue([mockBookingDetails as any]);

      const result = await bookingFactory.getBookingDetails(mockBookingUuid);

      expect(result).toBe(mockBookingDetails);
    });

    it('should throw an error if booking is not found', async () => {
      (mockBookingModel.getCompleteBookingDetails as jest.Mock).mockResolvedValue([]);

      await expect(bookingFactory.getBookingDetails(mockBookingUuid))
        .rejects.toThrow(BookingMessages.BookingNotFound);
    });
  });

});
