import { Request } from 'express';
import AddressFactory from '../../factories/tenant/addressFactory';
import { convertTo24HourFormat } from '../../helpers/tenants/formatters';
import { IOperationHour } from '../../interfaces/tenantInterface';
import { AddressErrors } from '../../enums/errorMessages';
import { addressColumnMappings } from '../../helpers/tenants/columnMapping';

class AddressService {
    /**
     * Add a new address for a tenant.
     * @param req - The Express request object containing the address data.
     * @returns A promise that resolves when the address is added.
     * @throws Error if the address addition fails.
     */
    public async addAddress(req: Request) {
        const data = req.body; // Extract address data from the request body
        const db = (req as any).knex; // Retrieve the knex instance for database operations

        // Construct tenant address and operation hours from the request data
        const { tenantAddress, operationHours } = this.constructAddressData(data);

        const addressFactory = new AddressFactory(db); // Create an instance of AddressFactory
        return await addressFactory.addAddress(tenantAddress, operationHours); // Add the address using the factory
    }

    /**
     * Update an existing address for a tenant.
     * @param req - The Express request object containing the address data.
     * @returns A promise that resolves when the address is updated.
     * @throws Error if the address update fails.
     */
    public async updateAddress(req: Request) {
        try {
            const data = req.body; // Extract updated address data from the request body
            const db = (req as any).knex; // Retrieve the knex instance for database operations
            const addressId = req.params.addressId; // Get the address ID from request parameters
            const id = parseInt(addressId);
            const role  =req.role;
            if(!id){
                throw new Error(AddressErrors.AddressIdRequired);
            }
            // Construct tenant address and operation hours from the request data
            const { tenantAddress, operationHours} = this.constructAddressData(data);

            const addressFactory = new AddressFactory(db); // Create an instance of AddressFactory
            return await addressFactory.updateAddress(id, { tenantAddress, operationHours,role }); // Update the address using the factory
        } catch (error) {
            throw error; // Propagate the error for handling by the caller
        }
    }

    /**
     * Retrieve an address for a tenant.
     * @param req - The Express request object containing the address ID.
     * @returns An object containing the address details and operation hours.
     * @throws Error if the address retrieval fails.
     */
    public async getAddress(req: Request) {
        try {
            const addressId = req.params.addressId; // Get the address ID from request parameters
            const db = (req as any).knex; // Retrieve the knex instance for database operations
            const id = parseInt(addressId);
            if(!id){
                throw new Error(AddressErrors.AddressIdRequired);
            }
            const addressFactory = new AddressFactory(db); // Create an instance of AddressFactory
            const result = await addressFactory.getAddress(id); // Retrieve the address using the factory
            // Map the result to address details
            const addressDetails = {
                id: result.result[0].id,
                contactFirstName: result.result[0].contact_first_name,
                contactLastName: result.result[0].contact_last_name,
                contactEmailId: result.result[0].email_id,
                contactPhoneNumberCountryCode: result.result[0].country_code,
                contactPhoneNumber: result.result[0].phone_number,
                contactAlternatePhoneNumber: result.result[0].alternate_phone_number,
                contactAlternatePhoneNumberCountryCode: result.result[0].alternate_phone_country_code,
                locationPhoneNumber: result.result[0].location_phone_number,
                locationCountryCode: result.result[0].location_country_code,
                addressLine1: result.result[0].address_line1,
                addressLine2: result.result[0].address_line2,
                city: { id: result.cityData.id, name: result.cityData.city_name },
                state: { id: result.stateData.id, name: result.stateData.state_name },
                country: { id: result.countryData.id, name: result.countryData.country_name },
                zipcode: result.result[0].zipcode,
            };

            // Map the result to operation hours
            let operationHours: any[] = [];
            if(result.result.length > 0 && result.result[0].day_of_week){
                operationHours = result.result.map((row: any) => ({
                    dayOfWeek: row.day_of_week,
                    startTime: row.start_time,
                    endTime: row.end_time
                }));
            }
            return { address: addressDetails, operationHours }; // Return the address details and operation hours
        } catch (error) {
            throw error; // Propagate the error for handling by the caller
        }
    }
    public async changeStatus(req: Request) {
        try {
            const addressId = req.params.addressId; // Get the address ID from request parameters
            const status = req.body.status; // Get the status from request body
            const db = (req as any).knex; // Retrieve the knex instance for database operations
            const role = req.role;
            const statusValue = {
                active: 1,
                Active: 1,
                inactive: 0,
                Inactive: 0
            } as { [key: string]: number };
            const id = parseInt(addressId);
            if(!id){
                throw new Error(AddressErrors.AddressIdRequired);
            }
            const addressFactory = new AddressFactory(db); // Create an instance of AddressFactory
            return await addressFactory.changeStatus(id, statusValue[status],role!); // Change the status using the factory
        } catch (error) {
            throw error; // Propagate the error for handling by the caller
        }
    }

    public async addressList(req: Request) {
        try {
            const db = (req as any).knex; // Retrieve the knex instance for database operations
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            let sortBy = req.query.sortBy ? req.query.sortBy as string : 'created_at';
            const sortOrder = req.query.sortOrder ? req.query.sortOrder as string : 'desc';
            const searchQuery = req.query.search ? req.query.search as string : '';
            let status = req.query.status ? req.query.status as string : 'ALL';
            const addressFactory = new AddressFactory(db); // Create an instance of AddressFactory
            if(status !== 'ALL' && status !== ''){
                status = status.toLowerCase();
                if(status === 'active'){
                    status = '1';
                }else if(status === 'inactive'){
                    status = '0';
                }
            }
            sortBy = addressColumnMappings[sortBy.toLowerCase()] || 'created_at';
            let result = await addressFactory.addressList(page, limit, sortBy, sortOrder, searchQuery, status); // Retrieve the address using the factory
            let formattedResult = {
                addresses: result.addresses.map((address: any) => ({
                    id: address.locationId,
                    locationName: address.locationname,
                    contactPersonName: address.contactpersonname,
                    countryCode: address.contactPhoneNumberCountryCode,
                    phoneNumber: address.phoneNumber,
                    status: address.status === 1 ? 'Active' : 'Inactive'
                })),
                totalPages: result.totalPages,
                currentPage: result.currentPage,
                totalRecords: result.totalRecords
            };
            return formattedResult;
        } catch (error) {
            throw error; // Propagate the error for handling by the caller
        }
    }
    /**
     * Construct tenant address and operation hours from request data.
     * @param data - The request body data.
     * @returns An object containing tenantAddress and operationHours.
     */
    private constructAddressData(data: any) {
        // Construct tenant address object from request data
        const tenantAddress = {
            address_line1: data.addressLine1,
            address_line2: data.addressLine2,
            city: data.city,
            state: data.state,
            country: data.country,
            zipcode: data.zipcode,
            contact_first_name: data.contactFirstName,
            contact_last_name: data.contactLastName,
            email_id: data.contactEmailId,
            phone_number: data.contactPhoneNumber,
            alternate_phone_number: data.contactAlternatePhoneNumber,
            country_code: data.contactPhoneNumberCountryCode,
            alternate_phone_country_code: data.contactAlternatePhoneNumberCountryCode,
            address_type: 2,
            location_phone_number: data.locationPhoneNumber || null,
            location_country_code: data.locationCountryCode || null,

        };

        // Construct operation hours array from request data
        const operationHours: IOperationHour[] = data.operationHours.map((hour: any) => ({
            dayOfWeek: hour.dayOfWeek,
            startTime: hour.startTime ? (hour.startTime.includes('AM') || hour.startTime.includes('PM') ? convertTo24HourFormat(hour.startTime) : hour.startTime) : null,
            endTime: hour.endTime ? (hour.endTime.includes('AM') || hour.endTime.includes('PM') ? convertTo24HourFormat(hour.endTime) : hour.endTime) : null,
        }));
        return { tenantAddress, operationHours }; // Return the constructed tenant address and operation hours
    }

}

export default new AddressService();
