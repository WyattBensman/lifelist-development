import { gql } from "@apollo/client";

export const VERIFY_ACCESS_CODE = gql`
  mutation VerifyAccessCode($code: String!) {
    verifyAccessCode(code: $code) {
      success
      message
    }
  }
`;

export const ASSOCIATE_USER_WITH_ACCESS_CODE = gql`
  mutation AssociateUserWithAccessCode($userId: ID!, $code: String!) {
    associateUserWithAccessCode(userId: $userId, code: $code) {
      success
      message
    }
  }
`;
