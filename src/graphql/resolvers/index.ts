import { mergeResolvers } from '@graphql-tools/merge';
import resolvers from "./territoriesResolver";
import TenantResolvers from "./tenantResolver";

export default mergeResolvers([resolvers, TenantResolvers]);
