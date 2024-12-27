import { gql } from "@apollo/client";

// === Mutation: Verify Access Code === //

export const VERIFY_ACCESS_CODE = gql`
  mutation VerifyAccessCode($code: String!) {
    verifyAccessCode(code: $code) {
      success
      message
    }
  }
`;

// === Mutation: Associate User with Access Code === //

export const ASSOCIATE_USER_WITH_ACCESS_CODE = gql`
  mutation AssociateUserWithAccessCode($userId: ID!, $code: String!) {
    associateUserWithAccessCode(userId: $userId, code: $code) {
      success
      message
    }
  }
`;
