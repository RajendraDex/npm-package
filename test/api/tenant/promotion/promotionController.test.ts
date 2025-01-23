import { Request, Response } from 'express';
import PromotionController from '../../../../src/controllers/tenant/promotionController';
import PromotionService from '../../../../src/services/tenant/promotionService';
import { PromotionMessages, ErrorMessages, CustomerMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';

// Mock the PromotionService
jest.mock('../../../../src/services/tenant/promotionService');

describe('PromotionController', () => {
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

  describe('createPromotion', () => {
    it('should create a promotion successfully', async () => {
      (PromotionService.createPromotion as jest.Mock).mockResolvedValue({});

      await PromotionController.createPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.CREATED);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.CreateSuccessful,
        code: ResponseCodes.CREATED,
        data: null
      }));
    });

    it('should handle promotion already exists error', async () => {
      (PromotionService.createPromotion as jest.Mock).mockRejectedValue(new Error(PromotionMessages.PromotionAlreadyExists));

      await PromotionController.createPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.CONFLICT);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.PromotionAlreadyExists,
        code: ResponseCodes.CONFLICT,
        data: null
      }));
    });

    it('should handle unknown errors', async () => {
      (PromotionService.createPromotion as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      await PromotionController.createPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: ErrorMessages.InternalServerError,
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('promotionDetails', () => {
    it('should retrieve promotion details successfully', async () => {
      const promotionDetails = { id: '1', name: 'Promotion 1' };
      (PromotionService.promotionDetails as jest.Mock).mockResolvedValue(promotionDetails);

      await PromotionController.promotionDetails(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: promotionDetails,
        message: PromotionMessages.PromotionDetails,
        code: ResponseCodes.OK
      }));
    });

    it('should handle promotion not found error', async () => {
      (PromotionService.promotionDetails as jest.Mock).mockRejectedValue(new Error(PromotionMessages.PromotionNotFound));

      await PromotionController.promotionDetails(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.PromotionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });
  });

  describe('updatePromotion', () => {
    it('should update a promotion successfully', async () => {
      const updatedPromotion = null;
      (PromotionService.updatePromotion as jest.Mock).mockResolvedValue(updatedPromotion);

      await PromotionController.updatePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: updatedPromotion,
        message: PromotionMessages.UpdateSuccessful,
        code: ResponseCodes.OK
      }));
    });

    it('should handle promotion not found error', async () => {
      (PromotionService.updatePromotion as jest.Mock).mockRejectedValue(new Error(PromotionMessages.PromotionNotFound));

      await PromotionController.updatePromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.PromotionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });
  });

  describe('changeStatus', () => {
    it('should change the status of a promotion successfully', async () => {
      (PromotionService.changeStatus as jest.Mock).mockResolvedValue({});

      await PromotionController.changeStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.UpdateSuccessful,
        code: ResponseCodes.OK,
        data: null
      }));
    });

    it('should handle promotion not found error', async () => {
      (PromotionService.changeStatus as jest.Mock).mockRejectedValue(new Error(PromotionMessages.PromotionNotFound));

      await PromotionController.changeStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.PromotionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });
  });

  describe('promotionList', () => {
    it('should retrieve a list of promotions successfully', async () => {
      const promotions = [{ id: '1', name: 'Promotion 1' }, { id: '2', name: 'Promotion 2' }];
      (PromotionService.promotionList as jest.Mock).mockResolvedValue(promotions);

      await PromotionController.promotionList(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: promotions,
        message: PromotionMessages.PromotionList,
        code: ResponseCodes.OK
      }));
    });

    it('should handle errors when retrieving promotions', async () => {
      (PromotionService.promotionList as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      await PromotionController.promotionList(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Fetch error',
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('applyPromotion', () => {
    it('should apply a promotion successfully', async () => {
      (PromotionService.applyPromotion as jest.Mock).mockResolvedValue({});

      await PromotionController.applyPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.PromotionApplied,
        code: ResponseCodes.OK,
        data: null
      }));
    });

    it('should handle customer not found error', async () => {
      (PromotionService.applyPromotion as jest.Mock).mockRejectedValue(new Error(CustomerMessages.CustomerNotFound));

      await PromotionController.applyPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: CustomerMessages.CustomerNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });

    it('should handle already availed promotion error', async () => {
      (PromotionService.applyPromotion as jest.Mock).mockRejectedValue(new Error(PromotionMessages.AlreadyAvaildPromotion));

      await PromotionController.applyPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.CONFLICT);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.AlreadyAvaildPromotion,
        code: ResponseCodes.CONFLICT,
        data: null
      }));
    });

    it('should handle promotion not found error', async () => {
      (PromotionService.applyPromotion as jest.Mock).mockRejectedValue(new Error(PromotionMessages.PromotionNotFound));

      await PromotionController.applyPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.PromotionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });

    it('should handle promotion expired error', async () => {
      (PromotionService.applyPromotion as jest.Mock).mockRejectedValue(new Error(PromotionMessages.PromotionExpired));

      await PromotionController.applyPromotion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.BAD_REQUEST);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PromotionMessages.PromotionExpired,
        code: ResponseCodes.BAD_REQUEST,
        data: null
      }));
    });
  });
});
