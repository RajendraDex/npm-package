import { mergeTypeDefs } from '@graphql-tools/merge';

import typeDefs from "./territoriesSchema";
import TenantTypeSchema from "./tenantSchema";

export default mergeTypeDefs([typeDefs, TenantTypeSchema]);
