import gql from 'graphql-tag';

const TenantTypeSchema = gql`
  type Tenant {
    id: ID!
    companyName: String!
    domain: String!
  }

  type Query {
    tenantList: [Tenant]!
  }
`;

export default TenantTypeSchema;
