import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Country {
    id: ID!
    name: String!
     createdAt:String!
    updatedAt:String!
  }

  type State {
    id: ID!
    name: String!
     createdAt:String!
    updatedAt:String!
  }

  type City {
    id: ID!
    name: String!
    createdAt:String!
    updatedAt:String!
  }

  type Query {
    countries(sortBy: String, sortOrder: String, searchQuery: String): [Country!]!
    states(countryId: ID!, sortBy: String, sortOrder: String, searchQuery: String): [State!]!
    cities(stateId: ID!, sortBy: String, sortOrder: String, searchQuery: String): [City!]!
  }
`;

export default typeDefs;
