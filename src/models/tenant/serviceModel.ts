import { Knex } from 'knex';

class ServiceListModel {
    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }
    /**
     * Fetches a list of services with optional pagination, sorting, and searching by service name, category name, or price.
     * @param page - The current page number for pagination.
     * @param limit - The number of services to retrieve per page.
     * @param sortBy - The column to sort by.
     * @param sortOrder - The order of sorting ('asc' or 'desc').
     * @param searchQuery - The search string to filter the services.
     * @param isDeleted - The status of the service to filter by.
     * @param status - The status of the service to filter by.
     * @returns A promise that resolves with the services, total pages, and the current page.
     */
    public async fetchServices(
        page: number,
        limit: number,
        sortBy: string = 'created_at',
        sortOrder: 'asc' | 'desc' = 'asc',
        searchQuery: string = '',
        isDeleted: number,
        status: number
    ): Promise<{ services: any[], totalPages: number, currentPage: number, totalRecords: number }> {
        try {
            const offset = (page - 1) * limit;
            const db = this.db; // Capture the db instance from the outer scope

            // Define the fields to search against
            const searchFields = ['tenant_service.service_name', 'tenant_service_categories.category_name', 'tenant_service.service_price'];

            // Start building the query
            const query = db('tenant_service')
                .distinctOn('tenant_service.service_uuid') // Ensure distinct services based on service_uuid
                .select([
                    'tenant_service.service_uuid',
                    'tenant_service.service_name',
                    'tenant_service.service_description',
                    'tenant_service.service_price',
                    'tenant_service.service_category_ids',
                    'tenant_service.is_deleted',
                    'tenant_service.service_status'
                ])
                .join('tenant_service_categories', function() {
                    this.on('tenant_service_categories.service_category_uuid', '=', db.raw('any (array(select json_array_elements_text(tenant_service.service_category_ids)))'))
                });

            // Define conditions based on isDeleted and status with explicit table names
            const conditions: Record<string, any> = {};
            if (isDeleted == 0 || isDeleted == 1) {
                conditions['tenant_service.is_deleted'] = isDeleted; 
            }

            if (status == 0 || status == 1) {
                conditions['tenant_service.service_status'] = status;
            }

            // Apply conditions to the query
            query.where(conditions);

            // Apply search filtering
            if (searchQuery) {
                query.where((builder) => {
                    searchFields.forEach(field => {
                        if (field === 'tenant_service.service_price') {
                            builder.orWhere(db.raw('CAST("tenant_service"."service_price" AS TEXT)'), 'ILIKE', `%${searchQuery}%`);
                        } else {
                            builder.orWhere(field, 'ILIKE', `%${searchQuery}%`);
                        }
                    });
                });
            }

            // Count total records for pagination
            const totalRecordsResult = await db('tenant_service')
                .join('tenant_service_categories', function() {
                    this.on('tenant_service_categories.service_category_uuid', '=', db.raw('any (array(select json_array_elements_text(tenant_service.service_category_ids)))'))
                })
                .where(conditions)
                .andWhere((builder) => {
                    searchFields.forEach(field => {
                        if (field === 'tenant_service.service_price') {
                            builder.orWhere(db.raw('CAST("tenant_service"."service_price" AS TEXT)'), 'ILIKE', `%${searchQuery}%`);
                        } else {
                            builder.orWhere(field, 'ILIKE', `%${searchQuery}%`);
                        }
                    });
                })
                .countDistinct('tenant_service.id as total');
            const totalRecords = parseInt(totalRecordsResult[0]?.total?.toString() || '0', 10);
            const totalPages = Math.ceil(totalRecords / limit);

            // Apply sorting and pagination
            query.orderBy('tenant_service.service_uuid').orderBy(sortBy, sortOrder).offset(offset).limit(limit);

            // Execute the query
            const services = await query;
            return {
                services,
                totalPages,
                currentPage: page,
                totalRecords
            };
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export default ServiceListModel; 