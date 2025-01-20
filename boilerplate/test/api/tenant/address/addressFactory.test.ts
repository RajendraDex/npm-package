import { Knex } from 'knex';
import Model from '../../../../src/models/generelisedModel';
import AddressModel from '../../../../src/models/tenant/addressModel';
import AddressFactory from '../../../../src/factories/tenant/addressFactory';
import { AddressErrors } from '../../../../src/enums/errorMessages';

jest.mock('../../../../src/models/generelisedModel');
jest.mock('../../../../src/models/tenant/addressModel');
jest.mock('../../../../src/db/knexfile', () => ({
    defaultKnex: jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        first: jest.fn()
    }))
}));

describe('AddressFactory', () => {
    let addressFactory: AddressFactory;
    let mockDb: Knex;
    let mockModel: jest.Mocked<Model>;
    let mockAddressModel: jest.Mocked<AddressModel>;

    beforeEach(() => {
        mockDb = {} as Knex;
        mockModel = new Model(mockDb) as jest.Mocked<Model>;
        mockAddressModel = new AddressModel(mockDb) as jest.Mocked<AddressModel>;
        addressFactory = new AddressFactory(mockDb);
        (addressFactory as any).addressModel = mockModel;
        (addressFactory as any).addressModelInstance = mockAddressModel;
    });

    describe('addAddress', () => {
        const mockTenantAddress = {
            contact_first_name: 'John',
            contact_last_name: 'Doe',
            email_id: 'john@example.com'
        };

        const mockOperationHours = [
            {
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '17:00'
            }
        ];

        it('should add a new address with operation hours successfully', async () => {
            mockModel.insert.mockResolvedValueOnce([{ id: 1 }]);
            mockModel.insert.mockResolvedValueOnce([{ id: 1 }]);

            await expect(addressFactory.addAddress(mockTenantAddress, mockOperationHours))
                .resolves.not.toThrow();
        });

        it('should throw an error if address insertion fails', async () => {
            mockModel.insert.mockRejectedValueOnce(new Error('Database error'));

            await expect(addressFactory.addAddress(mockTenantAddress, mockOperationHours))
                .rejects.toThrow('Database error');
        });
    });

    describe('updateAddress', () => {
        const mockAddressId = 1;
        const mockUpdateData = {
            tenantAddress: { contact_first_name: 'Jane' },
            operationHours: [
                {
                    dayOfWeek: 1,
                    startTime: '10:00',
                    endTime: '18:00'
                }
            ]
        };

        it('should update an existing address successfully', async () => {
            mockModel.select.mockResolvedValueOnce([{ id: 1 }]);
            mockModel.update.mockResolvedValueOnce(true);
            mockModel.delete.mockResolvedValueOnce(1);
            mockModel.insert.mockResolvedValueOnce([{ id: 1 }]);

            await expect(addressFactory.updateAddress(mockAddressId, mockUpdateData))
                .resolves.not.toThrow();
        });

        it('should throw an error if address is not found', async () => {
            mockModel.select.mockResolvedValueOnce([]);

            await expect(addressFactory.updateAddress(mockAddressId, mockUpdateData))
                .rejects.toThrow(AddressErrors.AddressNotFound);
        });
    });

    describe('getAddress', () => {
        const mockAddressId = 1;

        it('should retrieve address details successfully', async () => {
            const mockAddress = {
                id: 1,
                contact_first_name: 'John',
                city: 1,
                state: 1,
                country: 1
            };

            mockModel.selectWithLeftJoin.mockResolvedValueOnce([mockAddress]);

            const result = await addressFactory.getAddress(mockAddressId);
            expect(result).toBeDefined();
            expect(result.result).toEqual([mockAddress]);
        });

        it('should throw an error if address is not found', async () => {
            mockModel.selectWithLeftJoin.mockResolvedValueOnce([]);

            await expect(addressFactory.getAddress(mockAddressId))
                .rejects.toThrow(AddressErrors.AddressNotFound);
        });
    });

    describe('changeStatus', () => {
        const mockAddressId = 1;
        const newStatus = 1;

        it('should change the status of an address successfully', async () => {
            mockModel.select.mockResolvedValueOnce([{ id: 1 }]);
            mockModel.update.mockResolvedValueOnce(true);

            const result = await addressFactory.changeStatus(mockAddressId, newStatus,'Super Admin');
            expect(result).toBe(true);
        });

        it('should throw an error if address is not found', async () => {
            mockModel.select.mockResolvedValueOnce([]);

            await expect(addressFactory.changeStatus(mockAddressId, newStatus,'Super Admin'))
                .rejects.toThrow(AddressErrors.AddressNotFound);
        });
    });

    describe('addressList', () => {
        const mockParams = {
            page: 1,
            limit: 10,
            sortBy: 'created_at',
            sortOrder: 'desc',
            searchQuery: '',
            status: '1'
        };

        it('should retrieve address list successfully', async () => {
            const mockList = { data: [], total: 0 };
            mockAddressModel.addressList.mockResolvedValueOnce(mockList as any);

            const result = await addressFactory.addressList(
                mockParams.page,
                mockParams.limit,
                mockParams.sortBy,
                mockParams.sortOrder,
                mockParams.searchQuery,
                mockParams.status
            );

            expect(result).toEqual(mockList);
        });

        it('should throw an error if list retrieval fails', async () => {
            mockAddressModel.addressList.mockRejectedValueOnce(new Error('Database error'));

            await expect(addressFactory.addressList(
                mockParams.page,
                mockParams.limit,
                mockParams.sortBy,
                mockParams.sortOrder,
                mockParams.searchQuery,
                mockParams.status
            )).rejects.toThrow('Database error');
        });
    });
});
