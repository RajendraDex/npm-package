import TenantService from '../../services/tenant/tenantService';
import { Request } from 'express';

const resolvers = {
    Query: {
        /**
         * Retrieves a list of tenants with pagination, sorting, and search capabilities.
         * @param _ - Unused parameter.
         * @param args - The arguments for the query.
         * @param context - The context containing the Express request object.
         * @returns A promise that resolves to the list of tenants.
         * @throws Error if an internal server error occurs.
         */
        tenantList: async (_: any, args: any, context: { req: Request }) => {
            return await TenantService.getTenantList(context.req);
        }
    }
}

export default resolvers;
