import { Knex } from 'knex';
import { IOperationHour } from '../../interfaces/tenantInterface';

class IOperationHoursModel {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  /**
   * Add new operation hours to the database.
   * @param IOperationHour - The operation hours data to insert.
   * @returns The ID of the newly created operation hours record.
   * @throws Error if the insertion fails.
   */
  async addIOperationHours(IOperationHour: IOperationHour): Promise<number> {
    try {
      // Insert the new operation hours record and return the ID.
      const [id] = await this.knex('tenant_operation_hours').insert(IOperationHour).returning('id');
      return id;
    } catch (error) {
      console.error('Error adding operation hours:', error);
      throw error;
    }
  }

  /**
   * Retrieve operation hours by tenant address ID.
   * @param tenantAddressId - The ID of the tenant address to filter by.
   * @returns An array of operation hours for the specified tenant address.
   * @throws Error if the retrieval fails.
   */
  async getIOperationHoursByTenantAddressId(tenantAddressId: number): Promise<IOperationHour[]> {
    try {
      // Fetch and return operation hours associated with the given tenant address ID.
      return await this.knex('tenant_operation_hours').where('tenant_address_id', tenantAddressId);
    } catch (error) {
      console.error('Error retrieving operation hours:', error);
      throw error;
    }
  }

  /**
   * Update existing operation hours by ID or insert a new entry if no ID is provided.
   * @param id - The ID of the operation hours record to update (optional).
   * @param addressId - The ID of the tenant address to associate with the operation hours.
   * @param updates - The updates to apply to the operation hours record.
   * @returns The ID of the updated or newly created operation hours record.
   * @throws Error if the operation fails.
   */
  async updateIOperationHours(id: number | null, addressId: number, updates: Partial<IOperationHour>): Promise<number> {
    try {
      if (id) {
        // Update the operation hours record with the specified ID and return the updated ID.
        const [updatedId] = await this.knex('tenant_operation_hours')
          .where('id', id)
          .update(updates)
          .returning('id');
        if (!updatedId) {
          
          throw new Error('No operation hours found with the provided ID.');
        }

        return updatedId;
      } else {
        // If no ID is provided, insert a new operation hours record.
        const newEntry = { ...updates, tenant_address_id: addressId };
        const [newId] = await this.knex('tenant_operation_hours').insert(newEntry).returning('id');
        return newId;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete operation hours by ID.
   * @param id - The ID of the operation hours record to delete.
   * @throws Error if the deletion fails.
   */
  async deleteIOperationHours(id: number): Promise<void> {
    try {
      // Delete the operation hours record with the specified ID.
      await this.knex('tenant_operation_hours').where('id', id).del();
    } catch (error) {
      console.error('Error deleting operation hours:', error);
      throw error;
    }
  }

  /**
   * Clear existing operation hours by tenant ID.
   * @param tenantId - The ID of the tenant to clear operation hours for.
   * @throws Error if the deletion fails.
   */
  async clearOperationHoursByTenantId(tenantId: number): Promise<void> {
    try {
      await this.knex('tenant_operation_hours').where('tenant_address_id', tenantId).del();
    } catch (error) {
      console.error('Error clearing operation hours:', error);
      throw error;
    }
  }
}

export default IOperationHoursModel;
