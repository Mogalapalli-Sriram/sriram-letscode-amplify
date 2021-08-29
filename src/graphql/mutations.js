/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSecretData = /* GraphQL */ `
  mutation CreateSecretData(
    $input: CreateSecretDataInput!
    $condition: ModelSecretDataConditionInput
  ) {
    createSecretData(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateSecretData = /* GraphQL */ `
  mutation UpdateSecretData(
    $input: UpdateSecretDataInput!
    $condition: ModelSecretDataConditionInput
  ) {
    updateSecretData(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteSecretData = /* GraphQL */ `
  mutation DeleteSecretData(
    $input: DeleteSecretDataInput!
    $condition: ModelSecretDataConditionInput
  ) {
    deleteSecretData(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
