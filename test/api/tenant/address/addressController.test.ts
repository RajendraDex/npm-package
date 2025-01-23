import { Request, Response } from 'express';
import AddressController from '../../../../src/controllers/tenant/addressController';
import AddressService from '../../../../src/services/tenant/addressService';
import { AddressMessages, ErrorMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';
import { AddressErrors } from '../../../../src/enums/errorMessages';

// Mock the AddressService
jest.mock('../../../../src/services/tenant/addressService');

describe('AddressController', () => {
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

    describe('addAddress', () => {
        it('should add an address successfully', async () => {
            (AddressService.addAddress as jest.Mock).mockResolvedValue({});

            await AddressController.addAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.CREATED);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressMessages.CreateSuccessful,
                code: ResponseCodes.CREATED,
                data: null
            }));
        });

        it('should handle Internal Server Error', async () => {
            (AddressService.addAddress as jest.Mock).mockRejectedValue(new Error('Internal Server Error'));

            await AddressController.addAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: ErrorMessages.InternalServerError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: 'Internal Server Error'
            }));
        });
    });

    describe('updateAddress', () => {
        it('should update an address successfully', async () => {
            (AddressService.updateAddress as jest.Mock).mockResolvedValue({});

            await AddressController.updateAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressMessages.UpdateSuccessful,
                code: ResponseCodes.OK,
                data: null
            }));
        });

        it('should handle address not found error', async () => {
            (AddressService.updateAddress as jest.Mock).mockRejectedValue(new Error(AddressErrors.AddressNotFound));

            await AddressController.updateAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressErrors.AddressNotFound,
                code: ResponseCodes.NOT_FOUND,
                data: null
            }));
        });

        it('should handle address ID required error', async () => {
            (AddressService.updateAddress as jest.Mock).mockRejectedValue(new Error(AddressErrors.AddressIdRequired));

            await AddressController.updateAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.BAD_REQUEST);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressErrors.AddressIdRequired,
                code: ResponseCodes.BAD_REQUEST,
                data: null
            }));
        });
    });

    describe('getAddress', () => {
        it('should fetch address successfully', async () => {
            const addressDetails = { id: '1', street: 'Test Street' };
            (AddressService.getAddress as jest.Mock).mockResolvedValue(addressDetails);

            await AddressController.getAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                data: addressDetails,
                message: AddressMessages.FetchSuccessful,
                code: ResponseCodes.OK
            }));
        });

        it('should handle address not found error', async () => {
            (AddressService.getAddress as jest.Mock).mockRejectedValue(new Error(AddressErrors.AddressNotFound));

            await AddressController.getAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressErrors.AddressNotFound,
                code: ResponseCodes.NOT_FOUND,
                data: null
            }));
        });

        it('should handle address ID required error', async () => {
            (AddressService.getAddress as jest.Mock).mockRejectedValue(new Error(AddressErrors.AddressIdRequired));

            await AddressController.getAddress(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.BAD_REQUEST);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressErrors.AddressIdRequired,
                code: ResponseCodes.BAD_REQUEST,
                data: null
            }));
        });
    });

    describe('changeStatus', () => {
        it('should change address status successfully', async () => {
            (AddressService.changeStatus as jest.Mock).mockResolvedValue({});

            await AddressController.changeStatus(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressMessages.UpdateSuccessful,
                code: ResponseCodes.OK,
                data: null
            }));
        });

        it('should handle address not found error', async () => {
            (AddressService.changeStatus as jest.Mock).mockRejectedValue(new Error(AddressErrors.AddressNotFound));

            await AddressController.changeStatus(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressErrors.AddressNotFound,
                code: ResponseCodes.NOT_FOUND,
                data: null
            }));
        });

        it('should handle address ID required error', async () => {
            (AddressService.changeStatus as jest.Mock).mockRejectedValue(new Error(AddressErrors.AddressIdRequired));

            await AddressController.changeStatus(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.BAD_REQUEST);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: AddressErrors.AddressIdRequired,
                code: ResponseCodes.BAD_REQUEST,
                data: null
            }));
        });
    });

    describe('addressList', () => {
        it('should list all addresses successfully', async () => {
            const addresses = [{ id: '1', street: 'Test Street' }, { id: '2', street: 'Another Street' }];
            (AddressService.addressList as jest.Mock).mockResolvedValue(addresses);

            await AddressController.addressList(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                data: addresses,
                message: AddressMessages.FetchSuccessful,
                code: ResponseCodes.OK
            }));
        });

        it('should handle unknown errors', async () => {
            (AddressService.addressList as jest.Mock).mockRejectedValue(new Error('Unknown error'));

            await AddressController.addressList(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
                message: ErrorMessages.UnknownError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: null
            }));
        });
    });
});
