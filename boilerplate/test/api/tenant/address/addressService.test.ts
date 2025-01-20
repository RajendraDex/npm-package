import AddressService from '../../../../src/services/tenant/addressService';
import AddressFactory from '../../../../src/factories/tenant/addressFactory';
import { Request } from 'express';
import { convertTo24HourFormat } from '../../../../src/helpers/tenants/formatters';
import { AddressErrors } from '../../../../src/enums/errorMessages';

// Mock AddressFactory
jest.mock('../../../../src/factories/tenant/addressFactory');

// Mock helper functions
jest.mock('../../../../src/helpers/tenants/formatters', () => ({
    convertTo24HourFormat: jest.fn()
}));

describe('AddressService', () => {
    let mockRequest: Partial<Request> & { knex?: any };
    let mockAddressFactory: jest.Mocked<AddressFactory>;

    beforeEach(() => {
        mockRequest = {
            knex: {},
            body: {},
            params: {},
            query: {}
        };
        mockAddressFactory = new AddressFactory({} as any) as jest.Mocked<AddressFactory>;
        (AddressFactory as jest.MockedClass<typeof AddressFactory>).mockImplementation(() => mockAddressFactory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addAddress', () => {
        it('should add an address successfully', async () => {
            const mockAddressData = {
                addressLine1: '123 Main St',
                addressLine2: 'Suite 100',
                city: 1,
                state: 1,
                country: 1,
                zipcode: '12345',
                contactFirstName: 'John',
                contactLastName: 'Doe',
                contactEmailId: 'john@example.com',
                contactPhoneNumber: '1234567890',
                contactPhoneNumberCountryCode: '91',
                contactAlternatePhoneNumber: '',
                contactAlternatePhoneNumberCountryCode: '',
                operationHours: [
                    { dayOfWeek: 'MON', startTime: '09:00:00', endTime: '17:00:00' }
                ]
            };
            mockRequest.body = mockAddressData;
            const mockCreatedAddress = { id: 1, ...mockAddressData };
            mockAddressFactory.addAddress.mockResolvedValue(mockCreatedAddress as any);

            const result = await AddressService.addAddress(mockRequest as Request);

            expect(result).toEqual(mockCreatedAddress);
            expect(mockAddressFactory.addAddress).toHaveBeenCalled();
        });
    });

    describe('updateAddress', () => {
        it('should update an address successfully', async () => {
            const addressId = '1';
            const mockAddressData = {
                addressLine1: '123 Main St',
                operationHours: [
                    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }
                ]
            };
            mockRequest.params = { addressId };
            mockRequest.body = mockAddressData;
            const mockUpdatedAddress = { id: addressId, ...mockAddressData };
            mockAddressFactory.updateAddress.mockResolvedValue(mockUpdatedAddress as any);

            const result = await AddressService.updateAddress(mockRequest as Request);

            expect(result).toEqual(mockUpdatedAddress);
            expect(mockAddressFactory.updateAddress).toHaveBeenCalled();
        });

        it('should throw error when address ID is invalid', async () => {
            mockRequest.params = { addressId: 'invalid' };
            
            await expect(AddressService.updateAddress(mockRequest as Request))
                .rejects.toThrow(AddressErrors.AddressIdRequired);
        });
    });

    describe('getAddress', () => {
        it('should retrieve address details successfully', async () => {
            const mockAddressDetails = {
                result: [{
                    id: 1,
                    contact_first_name: 'John',
                    contact_last_name: 'Doe',
                    email_id: 'john@example.com',
                    country_code: '+1',
                    phone_number: '1234567890',
                    address_line1: '123 Main St',
                    day_of_week: 1,
                    start_time: '09:00',
                    end_time: '17:00'
                }],
                cityData: { id: 1, city_name: 'Test City' },
                stateData: { id: 1, state_name: 'Test State' },
                countryData: { id: 1, country_name: 'Test Country' }
            };

            mockRequest.params = { addressId: '1' };
            mockAddressFactory.getAddress.mockResolvedValue(mockAddressDetails);

            const result = await AddressService.getAddress(mockRequest as Request);

            expect(result).toHaveProperty('address');
            expect(result).toHaveProperty('operationHours');
            expect(mockAddressFactory.getAddress).toHaveBeenCalledWith(1);
        });
    });

    describe('addressList', () => {
        it('should retrieve address list successfully', async () => {
            const mockAddressList = {
                addresses: [{
                    locationId: 1,
                    locationname: 'Main Office',
                    contactpersonname: 'John Doe',
                    phoneNumber: '1234567890',
                    status: 1
                }],
                totalPages: 1,
                currentPage: 1,
                totalRecords: 1
            };

            mockRequest.query = {
                page: '1',
                limit: '10',
                sortBy: 'created_at',
                sortOrder: 'desc',
                search: '',
                status: 'ALL'
            };

            mockAddressFactory.addressList.mockResolvedValue(mockAddressList);

            const result = await AddressService.addressList(mockRequest as Request);

            expect(result).toHaveProperty('addresses');
            expect(result).toHaveProperty('totalPages');
            expect(result).toHaveProperty('currentPage');
            expect(result).toHaveProperty('totalRecords');
            expect(mockAddressFactory.addressList).toHaveBeenCalled();
        });
    });

    describe('changeStatus', () => {
        it('should change address status successfully', async () => {
            const addressId = '1';
            const status = 'Active';
            mockRequest.params = { addressId };
            mockRequest.body = { status };
            
            const mockStatusChangeResult = { success: true };
            mockAddressFactory.changeStatus.mockResolvedValue(mockStatusChangeResult);

            const result = await AddressService.changeStatus(mockRequest as Request);

            expect(result).toEqual(mockStatusChangeResult);
            expect(mockAddressFactory.changeStatus).toHaveBeenCalledWith(1, 1);
        });

        it('should throw error when address ID is invalid', async () => {
            mockRequest.params = { addressId: 'invalid' };
            mockRequest.body = { status: 'Active' };

            await expect(AddressService.changeStatus(mockRequest as Request))
                .rejects.toThrow(AddressErrors.AddressIdRequired);
        });
    });
});
