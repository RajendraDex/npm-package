import { Request, Response } from 'express';
import BookingController from '../../../../src/controllers/tenant/bookingController';
import BookingService from '../../../../src/services/tenant/bookingService';
import { BookingMessages, ErrorMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';

// Mock the BookingService
jest.mock('../../../../src/services/tenant/bookingService');

describe('BookingController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    responseJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: responseJson,
      setHeader: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      (BookingService.createBooking as jest.Mock).mockResolvedValue({});

      await BookingController.createBooking(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.CREATED);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: BookingMessages.CreateSuccessful,
        code: ResponseCodes.CREATED,
        data: null
      }));
    });

    it('should handle unknown errors', async () => {
      (BookingService.createBooking as jest.Mock).mockRejectedValue(new Error(ErrorMessages.UnknownError));

      await BookingController.createBooking(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: "Internal Server Error",
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('updateBooking', () => {
    it('should update a booking successfully', async () => {
      (BookingService.updateBooking as jest.Mock).mockResolvedValue({});

      await BookingController.updateBooking(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: BookingMessages.UpdateSuccessful,
        code: ResponseCodes.OK,
        data: null
      }));
    });

    it('should handle booking not found error', async () => {
      (BookingService.updateBooking as jest.Mock).mockRejectedValue(new Error(BookingMessages.BookingNotFound));

      await BookingController.updateBooking(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: BookingMessages.BookingNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });

    it('should handle unknown errors', async () => {
      (BookingService.updateBooking as jest.Mock).mockRejectedValue(new Error(ErrorMessages.UnknownError));

      await BookingController.updateBooking(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: "Internal Server Error",
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('getBookingDetails', () => {
    it('should fetch booking details successfully', async () => {
      const bookingDetails = { id: '1', customerName: 'John Doe' };
      (BookingService.getBookingDetails as jest.Mock).mockResolvedValue(bookingDetails);

      await BookingController.getBookingDetails(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: bookingDetails,
        message: BookingMessages.FetchSuccessful,
        code: ResponseCodes.OK
      }));
    });

    it('should handle booking not found error', async () => {
      (BookingService.getBookingDetails as jest.Mock).mockRejectedValue(new Error(BookingMessages.BookingNotFound));

      await BookingController.getBookingDetails(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: BookingMessages.BookingNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });

    it('should handle unknown errors', async () => {
      (BookingService.getBookingDetails as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      await BookingController.getBookingDetails(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: ErrorMessages.UnknownError,
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('listBookings', () => {
    it('should list all bookings successfully', async () => {
      const bookings = [{ id: '1', customerName: 'John Doe' }, { id: '2', customerName: 'Jane Doe' }];
      (BookingService.listBookings as jest.Mock).mockResolvedValue(bookings);

      await BookingController.listBookings(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: bookings,
        message: BookingMessages.FetchSuccessful,
        code: ResponseCodes.OK
      }));
    });

    it('should handle unknown errors', async () => {
      (BookingService.listBookings as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      await BookingController.listBookings(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: "Unknown error",
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('updateBookingStatus', () => {
    it('should update booking status successfully', async () => {
      (BookingService.updateBookingStatus as jest.Mock).mockResolvedValue({});

      await BookingController.updateBookingStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: BookingMessages.UpdateSuccessful,
        code: ResponseCodes.OK,
        data: null
      }));
    });

    it('should handle booking not found error', async () => {
      (BookingService.updateBookingStatus as jest.Mock).mockRejectedValue(new Error(BookingMessages.BookingNotFound));

      await BookingController.updateBookingStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: BookingMessages.BookingNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });

    it('should handle unknown errors', async () => {
      (BookingService.updateBookingStatus as jest.Mock).mockRejectedValue(new Error(ErrorMessages.InternalServerError));

      await BookingController.updateBookingStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: ErrorMessages.InternalServerError,
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });
}); 