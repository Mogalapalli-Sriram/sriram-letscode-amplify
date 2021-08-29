/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSecretData = /* GraphQL */ `
  query GetSecretData($id: ID!) {
    getSecretData(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listSecretData = /* GraphQL */ `
  query ListSecretData(
    $filter: ModelSecretDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSecretData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
