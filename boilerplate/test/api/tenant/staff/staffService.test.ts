import { Request } from 'express';
import staffService from '../../../../src/services/tenant/staffService'; // Import the singleton instance
import TenantStaffRepository from '../../../../src/repository/tenant/staffRepository';
import { Knex } from 'knex'; // Import Knex type

jest.mock('../../../../src/repository/tenant/staffRepository');

describe('StaffService', () => {
    let req: Partial<Request>;
    let knex: Knex; // Declare knex variable

    beforeEach(() => {
        // Initialize knex mock
        knex = {} as Knex; // Replace with actual knex instance or mock

        req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                emailId: 'john.doe@example.com',
                phoneNumber: '1234567890',
                password: 'password123',
                staffBrief: 'Brief description',
                dateOfJoining: '2023-01-01',
                gender: 'Male',
                addressLine1: '123 Main St',
                addressLine2: '',
                city: 'City',
                state: 'State',
                country: 'Country',
                pincode: '123456',
                profilePic: 'profile.jpg',
                staffType: 'Type',
                staffStatus: 'Active',
                createdBy: 'admin',
                providerSpecializations: {
                    staffId: 'specializationId',
                    specializationServices: [1, 2],
                },
            },
            params: { id: 'staffId' },
            query: { page: '1', limit: '10', search: '' }, // Convert numbers to strings
        };
    });

    it('should create a new staff member', async () => {
        const staffRepo = new TenantStaffRepository(knex); // Pass knex instance
        (staffRepo.findByEmailOrPhone as jest.Mock).mockResolvedValue(null);
        (staffRepo.add as jest.Mock).mockResolvedValue(req.body); // Ensure this returns the correct value

        const result = await staffService.createStaff(req as Request);
        expect(result); // Check the result
    });
});