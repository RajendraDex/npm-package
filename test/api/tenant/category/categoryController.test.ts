import { Request, Response } from 'express';
import CategoryController from '../../../../src/controllers/tenant/categoryController';
import CategoryService from '../../../../src/services/tenant/categoryService';

import { CategoryMessages, ErrorMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';

jest.mock('../../../../src/services/tenant/categoryService');

describe('CategoryController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        req = {};
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
        res = {
            status: statusMock,
        };
    });

    describe('createCategory', () => {
        it('should create a category and return success response', async () => {
            CategoryService.createCategory = jest.fn().mockResolvedValue(null);

            await CategoryController.createCategory(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.CREATED);
            expect(jsonMock).toHaveBeenCalledWith({
                message: CategoryMessages.CreateSuccessful,
                code: ResponseCodes.CREATED,
                data: null,
            });
        });

        it('should handle category already exists error', async () => {
            CategoryService.createCategory = jest.fn().mockRejectedValue(new Error(CategoryMessages.CategoryAlreadyExists));

            await CategoryController.createCategory(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.BAD_REQUEST);
            expect(jsonMock).toHaveBeenCalledWith({
                message: CategoryMessages.CategoryAlreadyExists,
                code: ResponseCodes.BAD_REQUEST,
                data: null,
            });
        });

        it('should handle internal server error', async () => {
            CategoryService.createCategory = jest.fn().mockRejectedValue(new Error('Some error'));

            await CategoryController.createCategory(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(jsonMock).toHaveBeenCalledWith({
                message: ErrorMessages.InternalServerError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: null,
            });
        });
    });

    // Similar tests for updateCategory, getCategories, changeCategoryStatus, and getCategoryById
    // ...

    describe('updateCategory', () => {
        it('should update a category and return success response', async () => {
            CategoryService.updateCategory = jest.fn().mockResolvedValue(null);

            await CategoryController.updateCategory(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(jsonMock).toHaveBeenCalledWith({
                message: CategoryMessages.CategoryUpdated,
                code: ResponseCodes.OK,
                data: null,
            });
        });

        it('should handle category not found error', async () => {
            CategoryService.updateCategory = jest.fn().mockRejectedValue(new Error(CategoryMessages.CategoryNotFound));

            await CategoryController.updateCategory(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
            expect(jsonMock).toHaveBeenCalledWith({
                message: CategoryMessages.CategoryNotFound,
                code: ResponseCodes.NOT_FOUND,
                data: null,
            });
        });

        it('should handle internal server error', async () => {
            CategoryService.updateCategory = jest.fn().mockRejectedValue(new Error('Some error'));

            await CategoryController.updateCategory(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(jsonMock).toHaveBeenCalledWith({
                message: ErrorMessages.InternalServerError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: null,
            });
        });
    });

    // Add similar tests for getCategories, changeCategoryStatus, and getCategoryById
    // ...
});