import { gql } from "@apollo/client";

// === Mutation: Add LifeList Experience === //

export const ADD_LIFELIST_EXPERIENCE = gql`
  mutation AddLifeListExperience(
    $lifeListId: ID!
    $experienceId: ID!
    $list: LifeListListEnum!
    $associatedShots: [ID]
  ) {
    addLifeListExperience(
      lifeListId: $lifeListId
      experienceId: $experienceId
      list: $list
      associatedShots: $associatedShots
    ) {
      success
      message
      lifeListExperienceId
    }
  }
`;

// === Mutation: Update LifeList Experience === //

export const UPDATE_LIFELIST_EXPERIENCE = gql`
  mutation UpdateLifeListExperience(
    $lifeListExperienceId: ID!
    $list: LifeListListEnum
    $associatedShots: [ID]
  ) {
    updateLifeListExperience(
      lifeListExperienceId: $lifeListExperienceId
      list: $list
      associatedShots: $associatedShots
    ) {
      success
      message
    }
  }
`;

// === Mutation: Remove LifeList Experience === //

export const REMOVE_LIFELIST_EXPERIENCE = gql`
  mutation RemoveLifeListExperience(
    $lifeListId: ID!
    $lifeListExperienceId: ID!
  ) {
    removeLifeListExperience(
      lifeListId: $lifeListId
      lifeListExperienceId: $lifeListExperienceId
    ) {
      success
      message
    }
  }
`;
