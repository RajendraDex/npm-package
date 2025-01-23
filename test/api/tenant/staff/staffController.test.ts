import { Request, Response } from 'express';
import StaffController from '../../../../src/controllers/tenant/staffController';
import StaffService from '../../../../src/services/tenant/staffService';
import { handleResponse } from '../../../../src/utils/error';
import { ResponseCodes } from '../../../../src/enums/responseCodes';
import { StaffMessages } from '../../../../src/enums/responseMessages';

jest.mock('../../../../src/services/tenant/staffService');
jest.mock('../../../../src/utils/error');

describe('StaffController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    it('should create staff successfully', async () => {
        req = { body: { name: 'John Doe' } };
        (StaffService.createStaff as jest.Mock).mockResolvedValue(req.body);

        await StaffController.createStaff(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(handleResponse(null, StaffMessages.CreateSuccessful, ResponseCodes.CREATED));
    });

    it('should handle staff already exists error', async () => {
        req = { body: { name: 'John Doe' } };
        (StaffService.createStaff as jest.Mock).mockRejectedValue(new Error(StaffMessages.StaffAlreadyExists));

        await StaffController.createStaff(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(handleResponse(null, StaffMessages.StaffAlreadyExists, ResponseCodes.BAD_REQUEST));
    });

    it('should update staff successfully', async () => {
        req = { body: { id: 1, name: 'John Doe Updated' } };
        (StaffService.updateStaff as jest.Mock).mockResolvedValue(req.body);

        await StaffController.updateStaff(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(handleResponse(null, StaffMessages.UpdateSuccessfull, ResponseCodes.OK));
    });

    it('should fetch staff successfully', async () => {
        req = {};
        const staffData = [{ id: 1, name: 'John Doe' }];
        (StaffService.fetchStaff as jest.Mock).mockResolvedValue(staffData);

        await StaffController.getStaff(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(handleResponse(staffData, StaffMessages.FetchSuccessful, ResponseCodes.OK));
    });

    it('should fetch staff by ID successfully', async () => {
        req = { params: { id: '1' } };
        const staffData = { id: 1, name: 'John Doe' };
        (StaffService.fetchStaffById as jest.Mock).mockResolvedValue(staffData);

        await StaffController.fetchStaff(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(handleResponse(staffData, StaffMessages.FetchSuccessful, ResponseCodes.OK));
    });

    it('should delete staff successfully', async () => {
        req = { params: { id: '1' } };
        (StaffService.fetchStaffById as jest.Mock).mockResolvedValue({ id: 1 });
        (StaffService.deleteStaff as jest.Mock).mockResolvedValue(undefined);

        await StaffController.deleteStaff(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(handleResponse(null, StaffMessages.DeleteSuccessfull, ResponseCodes.OK));
    });
});