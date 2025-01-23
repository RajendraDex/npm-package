import Model from '../../models/generelisedModel';
import { Knex } from 'knex';
import AuthUtils from '../../helpers/auth/authHelper';
import { IOperationHour } from '../../interfaces/tenantInterface';
import { AddressErrors } from '../../enums/errorMessages';
import { defaultKnex } from '../../db/knexfile';
import AddressModel from '../../models/tenant/addressModel';

class AddressFactory extends AuthUtils {
    private addressModel: Model;
    private addressModelInstance: AddressModel;

    constructor(db: Knex) {
        super();
        this.addressModel = new Model(db);
        this.addressModelInstance = new AddressModel(db);
    }

    /**
     * Add a new address and its operation hours to the database.
     * @param tenantAddress - The tenant address data to be inserted.
     * @param operationHours - The operation hours data to be associated with the address.
     * @throws Error if the insertion fails.
     */
    public async addAddress(tenantAddress: any, operationHours: any) {
        try {
            // Insert tenant address and retrieve the generated ID
            const existingAddress = await this.addressModel.select('tenant_address', { zipcode: tenantAddress.zipcode }, ['id']);
            if (existingAddress.length > 0) {
                throw new Error(AddressErrors.AddressAlreadyExists);
            }
            const tenantAddressId = await this.addressModel.insert('tenant_address', tenantAddress, ['id', 'zipcode']);
            // Map operation hours to include the tenant address ID
            const operationHoursData: IOperationHour[] = operationHours.map((hour: any) => ({
                day_of_week: hour.dayOfWeek,
                start_time: hour.startTime,
                end_time: hour.endTime,
                tenant_address_id: tenantAddressId[0].id, // Ensure the ID is correctly retrieved
            }));

            // Insert each operation hour into the database
            for (const operationHour of operationHoursData) {
                await this.addressModel.insert('tenant_operation_hours', operationHour, ['id']);
            }
        } catch (error: unknown) {
            throw error; // Propagate the error for handling by the caller
        }
    }

    /**
     * Update an existing address and its operation hours in the database.
     * @param addressId - The ID of the address to update.
     * @param data - The new data for the address and its operation hours.
     * @throws Error if the update fails or if the address ID is not provided.
     */
    public async updateAddress(addressId: number, data: any) {
        try {
            // Retrieve the address by ID to get its internal ID
            const address = await this.addressModel.select('tenant_address', { id: addressId }, ['id', 'address_type', 'status', 'zipcode']);
            if (!address || address.length === 0) {
                throw new Error(AddressErrors.AddressNotFound);
            }
            if (address[0].status === 0) {
                throw new Error(AddressErrors.CannotUpdateInactiveAddress);
            }

            if (address[0].address_type === 1 && data.role !== 'Super Admin') {
                throw new Error(AddressErrors.UnableToUpdateAddress);
            }
            const existingAddress = await this.addressModel.select('tenant_address', { zipcode: data.tenantAddress.zipcode }, ['id']);
            if (existingAddress.length > 0 && existingAddress[0].id !== addressId) {
                throw new Error(AddressErrors.AddressAlreadyExists);
            }

            // Update the address data in the database
            const success = await this.addressModel.update('tenant_address', 'id', addressId, data.tenantAddress);
            if (success) {
                // Delete existing operation hours for the address
                await this.addressModel.delete('tenant_operation_hours', 'tenant_address_id', addressId);
                // Insert updated operation hours
                const operationHoursData: IOperationHour[] = data.operationHours.map((hour: any) => ({
                    day_of_week: hour.dayOfWeek,
                    start_time: hour.startTime,
                    end_time: hour.endTime,
                    tenant_address_id: addressId, // Ensure the ID is correctly retrieved
                }));
                for (const operationHour of operationHoursData) {
                    await this.addressModel.insert('tenant_operation_hours', operationHour, ['id']);
                }
            }
        } catch (error: unknown) {
            throw error;
        }
    }

    /**
     * Retrieve an address and its operation hours from the database.
     * @param addressId - The ID of the address to retrieve.
     * @returns An object containing the address and its operation hours.
     * @throws Error if the address is not found or retrieval fails.
     */
    public async getAddress(addressId: number) {
        try {
            const fields = [
                'contact_first_name', 'contact_last_name', 'email_id', 'country_code', 'phone_number', 'alternate_phone_number', 'country_code', 'alternate_phone_country_code', 'address_line1', 'address_line2', 'city', 'state', 'country', 'zipcode', 'tenant_address.id',
                'tenant_operation_hours.day_of_week', 'tenant_operation_hours.start_time', 'tenant_operation_hours.end_time', 'location_phone_number', 'location_country_code'
            ];
            const result = await this.addressModel.selectWithLeftJoin(
                'tenant_address',
                'tenant_operation_hours',
                ['tenant_address.id', 'tenant_operation_hours.tenant_address_id'],
                { 'tenant_address.id': addressId },
                fields
            );
            if(result.length === 0){
                throw new Error(AddressErrors.AddressNotFound);
            }
            const [cityData, stateData, countryData] = await Promise.all([
                defaultKnex('city_master').where('id', result[0].city).select('id', 'city_name').first(),
                defaultKnex('state_master').where('id', result[0].state).select('id', 'state_name').first(),
                defaultKnex('country_master').where('id', result[0].country).select('id', 'country_name').first()
            ]);
            return { result, cityData, stateData, countryData };
        } catch (error: unknown) {
            throw error;
        }
    }

    /**
     * Change the status of an address in the database.
     * @param addressId - The ID of the address to update.
     * @param status - The new status to set for the address.
     * @returns The number of affected rows.
     * @throws Error if the address is not found or the update fails.
     */
    public async changeStatus(addressId: number, status: number, role: string) {
        try {
            const address = await this.addressModel.select('tenant_address', { id: addressId }, ['id', 'address_type']);
            if (!address || address.length === 0) {
                throw new Error(AddressErrors.AddressNotFound);
            }
            if (address[0].address_type === 1 && role !== 'Super Admin') {
                throw new Error(AddressErrors.CannotUpdateStatus);
            }

            return await this.addressModel.update('tenant_address', 'id', addressId, { status });
        } catch (error: unknown) {
            throw error;
        }
    }

    /**
     * Retrieve a list of addresses with pagination, sorting, and search functionality.
     * @param page - The page number for pagination.
     * @param limit - The number of records per page.
     * @param sortBy - The column to sort by.
     * @param sortOrder - The order to sort (asc or desc).
     * @param searchQuery - The search query to filter results.
     * @param status - The status to filter results.
     * @returns A paginated list of addresses.
     * @throws Error if the retrieval fails.
     */
    public async addressList(page: number, limit: number, sortBy: string, sortOrder: string, searchQuery: string, status: string) {
        try {
            return await this.addressModelInstance.addressList(page, limit, sortBy, sortOrder, searchQuery, status);
        } catch (error: unknown) {
            throw error;
        }
    }
}

export default AddressFactory;
