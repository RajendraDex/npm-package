import { Knex } from 'knex';

class DatabaseUtils {
    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    /**
     * Insert data into a specific table.
     * @param table - The table to insert data into.
     * @param data - The data to be inserted.
     * @param returnFields - Fields to return after insertion, default is empty.
     * @returns Inserted data or undefined if no fields are specified.
     * @throws Error if the insertion fails.
     */
    public async insert(table: string, data: any, returnFields: string[] = []): Promise<any> {
        try {
            // Return nothing if returnFields is empty, return all if it contains '*'
            const fieldsToReturn = returnFields.length === 0 ? [] : (returnFields.includes('*') ? '*' : returnFields);
            
            // Only call returning if fieldsToReturn is not empty
            const query = this.db(table).insert(data);
            if (fieldsToReturn.length > 0) {
                query.returning(fieldsToReturn);
                return await query; // Return data only if fields are specified
            }
            await query;
            return; // Return nothing if no fields are specified
        } catch (error) {
            throw new Error(); // Include error message for better debugging
        }
    }

    /**
     * Update a specific row in a table.
     * @param table - The table to update data in.
     * @param idColumn - The column name used to identify the row.
     * @param id - The value of the identifier column.
     * @param data - The data to be updated.
     * @returns The number of updated rows.
     * @throws Error if the update fails.
     */
    public async update(table: string, idColumn: string, id: any, data: any): Promise<any> {
        try {
            return await this.db(table).where(idColumn, id).update(data);
        } catch (error) {
            throw new Error();
        }
    }

    /**
     * Delete a specific row from a table.
     * @param table - The table to delete data from.
     * @param idColumn - The column used to identify the row.
     * @param id - The value of the identifier column.
     * @returns The number of deleted rows.
     * @throws Error if the deletion fails.
     */
    public async delete(table: string, idColumn: string, id: any): Promise<number> {
        try {
            return await this.db(table).where(idColumn, id).del();
        } catch (error) {
            throw new Error();
        }
    }

    /**
     * Select rows from a table based on conditions.
     * @param table - The table to select data from.
     * @param conditions - The conditions to filter the rows.
     * @param fields - The fields to select.
     * @returns An array of selected rows.
     * @throws Error if the selection fails.
     */
    public async select(table: string, conditions: any = {}, fields: string[] = []): Promise<any[]> {
        try {
            // Return all data if fields contains '*', return specific fields if provided, return nothing if fields is empty
            if (fields.length === 0) {
                return []; // Return nothing if no fields are specified
            }
            return await this.db(table).where(conditions).select(fields.includes('*') ? '*' : fields);
        } catch (error) {
            throw new Error(); // Include error message for better debugging
        }
    }

    /**
     * Select rows from a table based on multiple conditions.
     * @param table - The table to select data from.
     * @param column - The column to match against the values.
     * @param values - The array of values to match.
     * @param fields - The fields to select.
     * @returns An array of selected rows.
     * @throws Error if the selection fails.
     */
    public async selectMultiple(table: string, column: string, values: any[], fields: string[] = []): Promise<any[]> {
        try {
            // Return all data if fields contains '*', return specific fields if provided, return nothing if fields is empty
            if (fields.length === 0) {
                return []; // Return nothing if no fields are specified
            }
            return await this.db(table).whereIn(column, values).select(fields.includes('*') ? '*' : fields);
        } catch (error) {
            throw new Error(); // Include error message for better debugging
        }
    }

    /**
     * Fetch data with pagination, sorting, and searching.
     * @param table - The table name to fetch data from.
     * @param page - The page number for pagination.
     * @param limit - The number of items per page.
     * @param sortBy - The column to sort by.
     * @param sortOrder - The order to sort (asc/desc).
     * @param searchQuery - The search query for filtering results.
     * @param searchFields - The fields to search against.
     * @param returnFields - The fields to return in the result.
     * @param conditions - Optional additional conditions for filtering.
     * @returns An object with results and pagination information.
     * @throws Error if the fetch fails.
     */
    public async fetchData(
        table: string,
        page: number,
        limit: number,
        sortBy: string,
        sortOrder: 'asc' | 'desc',
        searchQuery: string,
        searchFields: string[],
        returnFields: string[],
        conditions: Record<string, any> = {},
    ): Promise<{ result: any[], totalPages: number, currentPage: number, totalRecords: number}> {
        try {
            const column = sortBy || 'created_at'; // Default to 'created_at' if sortBy is not provided

            if (page === 0 && limit === 0) {
                // Return all data from the table with requested fields
                const result = await this.db(table)
                    .select(returnFields.length > 0 ? returnFields : '*') // Select specified fields or all
                    .where(builder => {
                        if (searchQuery) {
                            searchFields.forEach(field => {
                                builder.orWhere(field, 'ILIKE', `%${searchQuery}%`);
                            });
                        }
                        Object.entries(conditions).forEach(([key, value]) => {
                            if (typeof value !== 'undefined') {
                                builder.where(key, value as any); // Cast value to any
                            }
                        });
                    })
                    .orderBy(column, sortOrder); // Sort results

                return {
                    result,
                    totalPages: 1,
                    currentPage: 1,
                    totalRecords: result.length
                };
            } else if (limit !== -1) {
                const offset = (page - 1) * limit; // Calculate offset for pagination

                // Get total number of records matching the criteria
                const totalCountResult = await this.db(table)
                    .count<{ count: string }[]>('id as count')
                    .where(builder => {
                        if (searchQuery) {
                            searchFields.forEach(field => {
                                builder.orWhere(field, 'ILIKE', `%${searchQuery}%`);
                            });
                        }
                        Object.entries(conditions).forEach(([key, value]) => {
                            if (typeof value !== 'undefined') {
                                builder.where(key, value as any); // Cast value to any
                            }
                        });
                    });

                let totalCount = parseInt(totalCountResult[0].count, 10); // Parse total count
                const totalPages = Math.ceil(totalCount / limit); // Calculate total pages

                // Fetch records with pagination, sorting, and searching
                const result = await this.db(table)
                    .select(returnFields.length > 0 ? returnFields : '*') // Select specified fields or all
                    .where(builder => {
                        if (searchQuery) {
                            searchFields.forEach(field => {
                                builder.orWhere(field, 'ILIKE', `%${searchQuery}%`);
                            });
                        }
                        Object.entries(conditions).forEach(([key, value]) => {
                            if (typeof value !== 'undefined') {
                                builder.where(key, value as any); // Cast value to any
                            }
                        });
                    })
                    .orderBy(column, sortOrder) // Sort results
                    .offset(offset) // Apply pagination offset
                    .limit(limit); // Limit results per page

                return {
                    result,
                    totalPages,
                    currentPage: page, // Return pagination info
                    totalRecords: totalCount
                };
            } else {
                // Fetch records with pagination, sorting, and searching
                const result = await this.db(table)
                    .select(returnFields.length > 0 ? returnFields : '*') // Select specified fields or all
                    .where(builder => {
                        if (searchQuery) {
                            searchFields.forEach(field => {
                                builder.orWhere(field, 'ILIKE', `%${searchQuery}%`);
                            });
                        }
                        Object.entries(conditions).forEach(([key, value]) => {
                            if (typeof value !== 'undefined') {
                                builder.where(key, value as any); // Cast value to any
                            }
                        });
                    })
                    .orderBy(column, sortOrder); // Sort results

                return {
                    result,
                    totalPages: 1,
                    currentPage: 1, // Return pagination info
                    totalRecords: result.length
                };
            }
        } catch (error) {
            throw new Error(); // Catch and throw an error if fetch fails
        }
    }

    /**
     * Select rows from a table with a join on another table.
     * @param table - The main table to select data from.
     * @param joinTable - The table to join with.
     * @param joinOn - An array containing the columns to join on [mainTableColumn, joinTableColumn].
     * @param conditions - The conditions to filter the rows.
     * @param fields - The fields to select.
     * @returns An array of selected rows.
     * @throws Error if the selection fails.
     */
    public async selectWithLeftJoin(table: string, joinTable: string, joinOn: [string, string], conditions: any, fields: string[] = []): Promise<any[]> {
        try {
            // Build the query with join and conditions
            const query = this.db(table)
                .leftJoin(joinTable, joinOn[0], '=', joinOn[1]) // Join the tables on specified columns
                .where(conditions) // Apply conditions
                .select(fields.length > 0 ? fields : '*'); // Select specified fields or all fields if none specified
            return await query; // Execute the query and return the result
        } catch (error) {
            throw new Error("Failed to fetch data with join."); // Throw an error if the selection fails
        }
    }

    /**
     * Batch update rows in a table based on an array of IDs.
     * @param table - The table to update.
     * @param ids - Array of IDs for which rows need to be updated.
     * @param updateData - The data to be updated.
     * @param batchSize - The size of each batch operation.
     * @returns Promise resolving to the number of rows affected.
     */
    public async batchUpdate(table: string, ids: number[], updateData: Record<string, any>, batchSize: number): Promise<number> {
        try {
            const results = await this.db.transaction(async trx => {
                let rowsAffected = 0;
                for (let i = 0; i < ids.length; i += batchSize) {
                    const batch = ids.slice(i, i + batchSize);
                    const result = await this.db(table)
                        .transacting(trx)
                        .whereIn('id', batch)
                        .update(updateData);
                    rowsAffected += result;
                }
                return rowsAffected;
            });
            return results;
        } catch (error) {
            throw new Error('Batch update failed');
        }
    }

    public async batchUpdateMultipleIdsAndData(table: string, ids: number[], updateDataArray: Record<string, any>[], batchSize: number): Promise<number> {
        try {
            const results = await this.db.transaction(async trx => {
                let rowsAffected = 0;
                for (let i = 0; i < ids.length; i += batchSize) {
                    const batchIds = ids.slice(i, i + batchSize);
                    const batchUpdateData = updateDataArray.slice(i, i + batchSize);
                    for (let j = 0; j < batchIds.length; j++) {
                        const id = batchIds[j];
                        const updateData = batchUpdateData[j];
                        const result = await this.db(table)
                            .transacting(trx)
                            .where('id', id)
                            .update(updateData);
                        rowsAffected += result;
                    }
                }
                return rowsAffected;
            });
            return results;
        } catch (error) {
            throw new Error('Batch update failed');
        }
    }

    /**
     * Batch insert rows into a table.
     * @param table - The table to insert data into.
     * @param data - Array of data objects to be inserted.
     * @param batchSize - The size of each batch operation.
     * @returns Promise resolving to the number of rows inserted.
     */
    public async batchInsert(table: string, data: Record<string, any>[], batchSize: number = 20 ): Promise<number> {
        try {
            const results = await this.db.batchInsert(table, data, batchSize).returning('id');
            return results.length; // Assuming the insert method returns the inserted items
        } catch (error) {
            throw new Error();
        }
    }
}

export default DatabaseUtils;
