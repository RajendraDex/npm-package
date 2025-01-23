import TenantModel from "../../models/master/tenantModel";
import Model from '../../models/generelisedModel';
import { Knex } from 'knex';
import AuthUtils from '../../helpers/auth/authHelper';
import { IAddress, IOperationHour, ITenant } from '../../interfaces/tenantInterface';
import { initializeDatabase } from "../../db/createAndMigrateDatabase";
import AddressModel from "../../models/tenant/addressModel";
import IOperationHoursModel from "../../models/tenant/operationHoursModel";
import { insertTenantStaff } from "../../db/migrations/conditionalMigrations";
import { ErrorMessages, TenantMessages } from "../../enums/responseMessages";
import { defaultKnex, getKnexWithConfig } from "../../db/knexfile";
import { formatString } from "../../helpers/tenants/formatters";

/**
 * TenantFactory class handles tenant-related operations such as creating, updating, and fetching tenants.
 * Extends AuthUtils for authentication-related utilities.
 */
class TenantFactory extends AuthUtils {
  private tenantModel: TenantModel;
  private generalModel: Model;

  /**
   * Constructor initializes the TenantFactory with a database connection.
   * @param db - The Knex database instance.
   */
  constructor(db: Knex) {
    super();
    this.generalModel = new Model(db);
    this.tenantModel = new TenantModel(db);
  }

  /**
   * Checks if a tenant already exists based on the domain name.
   * @param domainName - The domain name to check.
   * @returns A promise that resolves to a boolean indicating if the tenant exists.
   */
  private async tenantExists(domainName: string): Promise<boolean> {
    const existingTenant = await this.tenantModel.findByDomainName(domainName);
    return !!existingTenant;
  }

  private async companyExists(companyName: string): Promise<boolean> {
    const existingCompany = await this.generalModel.select('tenant_master', { tenant_name: companyName }, ['tenant_name']);
    return existingCompany.length > 0;
  }
  /**
   * Creates a new tenant.
   * @param data - The tenant data from the request.
   * @returns A promise that resolves to the created tenant.
   * @throws Error if the tenant or domain already exists.
   */
  public async createTenant(data: any): Promise<ITenant> {
    try {
      // Extract data from the incoming request
      const {
        companyName,
        registrationNumber,
        emailId,
        phoneNumber,
        username,
        password,
        domainName,
        addressLine1,
        addressLine2,
        city,
        state,
        countryCode,
        country,
        zipcode,
        contactFirstName,
        contactLastName,
        contactEmailId,
        contactPhoneNumber,
        contactAlternatePhoneNumber,
        contactPhoneNumberCountryCode,
        contactAlternatePhoneNumberCountryCode,
        operationHours,
        profilePic,
      } = data;
      // Check if tenant or domain already exists
      if (await this.tenantExists(domainName) || await this.companyExists(companyName)) {
        throw new Error(TenantMessages.DomainAlreadyExists);
      }

      // Generate a UUID for the tenant
      const tenantUUID = this.generateUUID();

      // Hash the provided password
      const hashedPassword = await this.hashPassword(password);

      // Prepare the tenant object with the necessary fields
      const tenant: ITenant = {
        tenant_uuid: tenantUUID,
        tenant_name: companyName,
        contact_first_name: formatString(contactFirstName),
        contact_last_name: formatString(contactLastName!),
        email_id: emailId,
        country_code: countryCode || 0,
        phone_number: phoneNumber || '',
        registration_number: registrationNumber,
        tenant_subdomain: domainName.toLowerCase(),
        profile_pic: profilePic,
        tenant_username: username,
        alternate_phone_number: contactAlternatePhoneNumber,
        tenant_status: 1, // Default to active status
        db_name: domainName.toLowerCase(),
        db_host: process.env.MASTER_DB_HOST,
        db_username: process.env.MASTER_DB_USER,
        db_password: process.env.MASTER_DB_PASSWORD,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Prepare the tenant address object
      const tenantAddress: IAddress = {
        contact_first_name: formatString(contactFirstName),
        contact_last_name: formatString(contactLastName!),
        email_id: contactEmailId,
        country_code: contactPhoneNumberCountryCode,
        phone_number: contactPhoneNumber,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city: city,
        state: state,
        country: country,
        zipcode: zipcode,
        alternate_phone_number: contactAlternatePhoneNumber,
        alternate_phone_country_code: contactAlternatePhoneNumberCountryCode,
        address_type: 1,
      };

      // Insert the tenant into the master database
      const createdTenant = await this.tenantModel.createTenant(tenant);
      if (createdTenant && createdTenant[0]) {
        const { db_name, db_host, db_username, db_password } = createdTenant[0];

        // Initialize the database using the tenant-specific credentials
        await initializeDatabase({
          host: db_host,
          user: db_username,
          password: db_password, // Use original password before hashing
          database: db_name,
          port: 5432, // Use the appropriate port
        });

        // Create a new Knex instance for the tenant's specific database
        const tenantKnex = getKnexWithConfig({
          host: db_host,
          user: db_username,
          password: db_password,
          database: db_name,
          port: 5432,
        });

        // Save the tenant address in the tenant's database
        const addressModel = new AddressModel(tenantKnex);
        const tenantAddressId = await addressModel.addAddress(tenantAddress); // Save address and get the ID
        const operationHoursData: any[] = operationHours.map((hour: any) => ({
          day_of_week: hour.dayOfWeek,
          start_time: hour.startTime,
          end_time: hour.endTime,
          tenant_address_id: tenantAddressId,
        }));

        const operationHoursModel = new IOperationHoursModel(tenantKnex);
        for (const operationHour of operationHoursData) {
          await operationHoursModel.addIOperationHours(operationHour);
        }

        // Insert the tenant's primary contact as a staff member
        await insertTenantStaff(tenantKnex, {
          staff_uuid: this.generateUUID(),
          first_name: formatString(contactFirstName),
          last_name: formatString(contactLastName!),
          email_id: emailId,
          phone_number: contactPhoneNumber,
          password: hashedPassword, // Save hashed password
          date_of_joining: new Date().toISOString().split('T')[0], // Current date
          address_line1: addressLine1,
          address_line2: addressLine2 || '',
          city: city,
          state: state,
          country: country,
          pincode: zipcode,
          profile_pic: '',
          staff_experience: null,
          mobile_number: phoneNumber,
          country_code: countryCode
        });
      }

      return createdTenant[0]; // Return the first created tenant
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing tenant.
   * @param tenantId - The UUID of the tenant to update.
   * @param data - The updated tenant data.
   * @returns A promise that resolves when the tenant is updated.
   * @throws Error if the tenant does not exist or other issues occur.
   */
  public async updateTenant(tenantId: string, data: any): Promise<void> {
    try {
      // Retrieve the existing tenant
      const existingTenant = await this.tenantModel.findByUUID(tenantId);
      if (!existingTenant) {
        throw new Error(TenantMessages.CompanyNotExists);
      }

      // Extract fields from the incoming request
      const {
        companyName,
        registrationNumber,
        emailId,
        phoneNumber,
        username,
        password,
        addressLine1,
        addressLine2,
        city,
        state,
        countryCode,
        country,
        zipcode,
        contactFirstName,
        contactLastName,
        contactEmailId,
        contactPhoneNumber,
        contactAlternatePhoneNumber,
        contactAlternatePhoneNumberCountryCode,
        operationHours,
        profilePic
      } = data;

      // Check if company name is being updated and if it already exists under a different ID
      if (companyName && companyName !== existingTenant.tenant_name) {
        const companyExists = await this.companyExists(companyName);
        if (companyExists) {
          throw new Error(TenantMessages.TenantAlreadyExists);
        }
      }


      // Update tenant fields
      const updatedTenant: ITenant = {
        ...existingTenant,
        tenant_name: companyName || existingTenant.tenant_name,
        contact_first_name: formatString(contactFirstName) || existingTenant.contact_first_name,
        contact_last_name: formatString(contactLastName!) || existingTenant.contact_last_name,
        email_id: emailId || existingTenant.email_id,
        phone_number: phoneNumber || existingTenant.phone_number,
        registration_number: registrationNumber || existingTenant.registration_number,
        alternate_phone_number: contactAlternatePhoneNumber || existingTenant.alternate_phone_number,
        updated_at: new Date(),
        country_code: countryCode || existingTenant.country_code,
        profile_pic: profilePic || existingTenant.profile_pic,
        tenant_username: username || existingTenant.tenant_username,
      };

      // Save the updated tenant in the master database
      await this.tenantModel.updateTenant(tenantId, updatedTenant);

      // Common DB config for tenant
      const tenantDbConfig = getKnexWithConfig({
        host: existingTenant.db_host,
        user: existingTenant.db_username,
        password: existingTenant.db_password,
        database: existingTenant.db_name,
        port: 5432,
      });

      // Step 3: Update the tenant address
      const addressModel = new AddressModel(tenantDbConfig);

      const tenantAddress: IAddress = {
        contact_first_name: formatString(contactFirstName) || existingTenant.contact_first_name,
        contact_last_name: formatString(contactLastName!) || existingTenant.contact_last_name,
        email_id: contactEmailId || existingTenant.email_id,
        country_code: countryCode || existingTenant.country_code,
        phone_number: contactPhoneNumber || existingTenant.phone_number,
        address_line1: addressLine1 || existingTenant.address_line1,
        address_line2: addressLine2 || existingTenant.address_line2,
        city: city || existingTenant.city,
        state: state || existingTenant.state,
        country: country || existingTenant.country,
        zipcode: zipcode || existingTenant.zipcode,
        alternate_phone_number: contactAlternatePhoneNumber || existingTenant.alternate_phone_number,
        alternate_phone_country_code: contactAlternatePhoneNumberCountryCode || existingTenant.alternate_phone_country_code
      };

      // Update the tenant address in the tenant's database
      const addressId = await addressModel.updateAddress(tenantAddress); // Assuming you have an updateAddress method

      // Step 4: Update operation hours
      const operationHoursModel = new IOperationHoursModel(tenantDbConfig);

      // Clear existing operation hours before updating
      await operationHoursModel.clearOperationHoursByTenantId(addressId); // Assuming addressId is linked to tenantId appropriately

      // Ensure operationHours is defined before mapping
      const operationHoursData: any[] = (operationHours || []).map((hour: any) => ({
        day_of_week: hour.dayOfWeek,
        start_time: hour.startTime,
        end_time: hour.endTime,
        tenant_address_id: addressId,
      }));

      // Insert new operation hours
      for (const operationHour of operationHoursData) {
        await operationHoursModel.addIOperationHours(operationHour);
      }

      // Hash the new password if provided
      let hashedPassword = existingTenant.password; // Assume password is stored in existingTenant
      if (password) {
        hashedPassword = await this.hashPassword(password);
        await tenantDbConfig('tenant_staff')
          .where({ staff_type: 'super' })
          .update({ password: hashedPassword });
      }


      return;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches a paginated list of tenants.
   * @param page - The page number to fetch.
   * @param limit - The number of tenants per page.
   * @param sortBy - The field to sort by.
   * @param sortOrder - The order to sort (asc or desc).
   * @param searchQuery - The search query to filter tenants.
   * @param status - Optional status to filter tenants.
   * @returns A promise that resolves to an object containing the result, total pages, and current page.
   */
  public async fetchTenants(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string,
    status?: number
  ) {
    try {
      const { result, totalPages, currentPage, totalRecords } = await this.tenantModel.fetchTenants(
        page,
        limit,
        sortBy,
        sortOrder,
        searchQuery,
        status
      );

      // Map the result to the desired format
      const formattedResult = result.map(tenant => ({
        id: tenant.tenant_uuid,
        tenantName: tenant.tenant_name,
        email: tenant.email_id,
        countryCode: tenant.country_code,
        phoneNumber: tenant.phone_number,
        tenantStatus: tenant.tenant_status,
        contactFirstName: tenant.contact_first_name,
        contactLastName: tenant.contact_last_name,
        domain: tenant.tenant_subdomain
      }));
      return {
        result: formattedResult,
        totalPages,
        currentPage,
        totalRecords
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetches a single tenant by their UUID.
   * @param tenantId - The UUID of the tenant to fetch.
   * @returns A promise that resolves to the tenant data including address and operation hours.
   * @throws Error if the tenant or address does not exist.
   */
  public async fetchTenant(tenantId: string) {
    try {
      // Step 1: Retrieve the tenant's database configuration from the master database
      const tenant = await this.tenantModel.findByUUID(tenantId);
      if (!tenant) {
        throw new Error(TenantMessages.CompanyNotExists);
      }
      // Step 2: Initialize a connection to the tenant's database
      const { db_name, db_host, db_username, db_password } = tenant;
      const tenantKnex = getKnexWithConfig({
        host: db_host,
        user: db_username,
        password: db_password,
        database: db_name,
        port: 5432, // Use the appropriate port
      });

      // Step 3: Fetch the tenant's address and operation hours from the tenant's database
      const addressModel = new AddressModel(tenantKnex);
      const operationHoursModel = new IOperationHoursModel(tenantKnex);

      // Fetch tenant address
      const tenantAddress = await addressModel.getAddress();
      if (tenantAddress.length === 0) {
        throw new Error(TenantMessages.AddressNotFound);
      }

      // Collect all unique city, state, and country IDs
      const cityIds = [...new Set(tenantAddress.map(address => address.city))];
      const stateIds = [...new Set(tenantAddress.map(address => address.state))];
      const countryIds = [...new Set(tenantAddress.map(address => address.country))];
      // Fetch city, state, and country data in bulk using selectMultiple
      const [cities, states, countries] = await Promise.all([
        this.generalModel.selectMultiple('city_master', 'id', cityIds, ['id', 'city_name']),
        this.generalModel.selectMultiple('state_master', 'id', stateIds, ['id', 'state_name']),
        this.generalModel.selectMultiple('country_master', 'id', countryIds, ['id', 'country_name'])
      ]);
      // Map to easily access city, state, and country by ID
      const cityMap = new Map(cities.map(city => [city.id, city.city_name]));
      const stateMap = new Map(states.map(state => [state.id, state.state_name]));
      const countryMap = new Map(countries.map(country => [country.id, country.country_name]));
      // Format addresses with the fetched city, state, and country data
      const formattedAddress = tenantAddress.map(address => ({
        id: address.id,
        contactFirstName: formatString(address.contact_first_name),
        contactLastName: formatString(address.contact_last_name),
        email: address.email_id,
        contactPhoneNumberCountryCode: address.country_code,
        phoneNumber: address.phone_number,
        alternatePhoneNumber: address.alternate_phone_number,
        alternatePhoneNumberCountryCode: address.alternate_phone_country_code,
        addressLine1: address.address_line1,
        addressLine2: address.address_line2,
        city: { id: address.city, name: cityMap.get(address.city) },
        state: { id: address.state, name: stateMap.get(address.state) },
        country: { id: address.country, name: countryMap.get(address.country) },
        zipcode: address.zipcode,
        addressType: address.address_type === 1 ? 'Primary' : address.address_type === 2 ? 'Secondary' : 'Other',
      }));

      let primaryAddress = null;
      const otherAddresses = [];
      let operationHours: IOperationHour[] = [];
      for (const address of formattedAddress) {
        if (address.addressType === 'Primary') {
          primaryAddress = address;
          operationHours = await operationHoursModel.getIOperationHoursByTenantAddressId(address.id);
        } else {
          otherAddresses.push(address);
        }
      }
      const formattedOperationHours = operationHours.map((hour: IOperationHour) => ({
        id: hour.id,
        dayOfWeek: hour.day_of_week,
        startTime: hour.start_time,
        endTime: hour.end_time,
      }));

      // Step 4: Format and return the combined result
      return {
        id: tenant.tenant_uuid,
        tenantName: tenant.tenant_name,
        email: tenant.email_id,
        phoneNumber: tenant.phone_number,
        tenantStatus: tenant.tenant_status,
        contactFirstName: formatString(tenant.contact_first_name),
        contactLastName: formatString(tenant.contact_last_name),
        alternatePhoneNumber: tenant.alternate_phone_number,
        username: tenant.tenant_username,
        profilePic: tenant.profile_pic,
        countryCode: tenant.country_code,
        registrationNumber: tenant.registration_number,
        tenantSubdomain: tenant.tenant_subdomain,
        status: tenant.tenant_status,
        address: otherAddresses,
        primaryAddress: primaryAddress,
        operationHours: formattedOperationHours,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === TenantMessages.CompanyNotExists) {
          throw new Error(TenantMessages.CompanyNotExists);
        }
        if (error.message === TenantMessages.AddressNotFound) {
          throw new Error(TenantMessages.AddressNotFound);
        }
      }
      // For unknown errors
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Updates the status of a tenant.
   * @param tenantId - The UUID of the tenant to update.
   * @param newStatus - The new status to set for the tenant.
   * @returns A promise that resolves to the result of the update operation.
   * @throws Error if the tenant does not exist or other issues occur.
   */
  public async updateTenantStatus(tenantId: string, newStatus: number) {
    try {
      // Step 1: Retrieve the tenant from the master database
      const tenant = await this.tenantModel.findByUUID(tenantId);

      if (!tenant) {
        throw new Error(`Tenant with ID ${tenantId} not found.`);
      }

      // Step 2: Update the tenant's status
      tenant.tenant_status = newStatus;
      tenant.updated_at = new Date();

      // Step 3: Save the updated tenant information back to the master database
      const result = await this.tenantModel.updateTenantStatus(tenantId, newStatus);
      return result;
    } catch (error) {
      throw error; // Ensure error is properly propagated
    }
  }

  public async getAddresses(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery: string): Promise<{ result: any[], totalPages: number, currentPage: number }> {
    try {
      // Define searchable and returnable fields for services
      const searchFields = ['contact_first_name'];
      const returnFields = ['id', 'address_line1', 'address_line2','address_type'];

      // Fetch the data with pagination, sorting, and search capabilities
      return await this.generalModel.fetchData('tenant_address', page, limit, sortBy, sortOrder, searchQuery, searchFields, returnFields);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error; // Rethrow known errors
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  public async getTenantList(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery: string): Promise<any> {
    try {
      const { result } = await this.generalModel.fetchData('tenant_master', page, limit, sortBy, sortOrder, searchQuery, ['tenant_name'], ['tenant_uuid as id', 'tenant_name as companyName', 'tenant_subdomain as domain']);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default TenantFactory;
