import { makeExecutableSchema } from '@graphql-tools/schema';
import typeDefs from './schema';
import resolvers from './resolvers';

// Create executable schema
export const gqlSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});