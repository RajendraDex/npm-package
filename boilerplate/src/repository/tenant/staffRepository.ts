import { Knex } from 'knex'; // Import Knex for database interactions
import TenantStaffModel from '../../models/tenant/staffModel'; // Import the model for tenant staff
import { ITenantStaff } from '../../interfaces/tenantInterface'; // Import the interface for tenant staff structure

// Define the TenantStaffRepository class
class TenantStaffRepository extends TenantStaffModel {
 
  // Constructor to initialize the repository with a Knex instance
  constructor(knex: Knex) {
    super(knex)
  }

  /**
   * Adds a new tenant staff member to the database.
   * @param tenantStaff - The tenant staff member to add.
   * @returns The ID of the newly added tenant staff member.
   */
  async add(tenantStaff: ITenantStaff): Promise<any> {
    return this.addTenantStaff(tenantStaff); // Call the inherited method to add tenant staff
  }

  /**
   * Updates an existing tenant staff member's information.
   * @param id - The ID of the tenant staff member to update.
   * @param updates - The updates to apply to the tenant staff member.
   * @returns The number of affected rows.
   */
  async update(id: string, updates: Partial<ITenantStaff>): Promise<number> {
    return this.updateTenantStaff(id, updates); // Updated to use editTenantStaff
  }

  /**
   * Deletes a tenant staff member by their ID.
   * @param id - The ID of the tenant staff member to delete.
   */
  async delete(id: string): Promise<void> {
    return this.deleteTenantStaff(id); // Call the model's method to delete tenant staff
  }


  /*
   * Retrieves all tenant staff members, optionally filtered by criteria.
   * @param filter - Optional filter criteria for retrieving tenant staff.
   * @param pagination - Pagination parameters including page and limit.
   * @returns An object containing an array of tenant staff members and total count.
   */
  async findAll(filter: { search: string; location: string; }, pagination: { page: number; limit: number; searchWithPagination?: boolean; },type:string){
    pagination.searchWithPagination = true;
    return this.getAllTenantStaff(filter, pagination,type); // Call the model's method to get all tenant staff
  }

  /**
   * Finds a tenant staff member by their email address.
   * @param email - The email address of the tenant staff member to find.
   * @returns The tenant staff member if found, otherwise undefined.
   */
  async findByEmail(email: string): Promise<ITenantStaff | undefined> {
    return super.findByEmail(email); // Call the parent class's method to find tenant staff by email
  }

  /**
   * Finds a tenant staff member by their UUID.
   * @param UUID - The UUID of the tenant staff member to find.
   * @returns The tenant staff member if found, otherwise undefined.
   */
  async findByUUID(UUID: string): Promise<ITenantStaff | undefined> {
    return super.findByUUID(UUID); // Call the parent class's method to find tenant staff by UUID
  }

  /**
   * Checks if a tenant staff member exists by email or phone number.
   * @param email - The email address of the tenant staff member.
   * @param phone - The phone number of the tenant staff member.
   * @returns The tenant staff member if found, otherwise undefined.
   */
  async findByEmailOrPhone(email: string, phone: string): Promise<ITenantStaff | undefined> {
    return this.findByEmail(email) || this.findByPhone(phone); // Check both email and phone
  }


}

// Export the TenantStaffRepository class for use in other modules
export default TenantStaffRepository;