import { gql } from "@apollo/client";

export const ADD_EXPERIENCE_TO_LIFELIST = gql`
  mutation AddExperienceToLifeList(
    $lifeListId: ID!
    $experienceId: ID!
    $list: String!
    $associatedShots: [ID]
    $associatedCollages: [ID]
  ) {
    addExperienceToLifeList(
      lifeListId: $lifeListId
      experienceId: $experienceId
      list: $list
      associatedShots: $associatedShots
      associatedCollages: $associatedCollages
    ) {
      success
      message
    }
  }
`;

export const REMOVE_EXPERIENCES_FROM_LIFELIST = gql`
  mutation RemoveExperiencesFromLifeList(
    $lifeListId: ID!
    $experienceIds: [ID!]!
  ) {
    removeExperiencesFromLifeList(
      lifeListId: $lifeListId
      experienceIds: $experienceIds
    ) {
      success
      message
    }
  }
`;

export const UPDATE_LIFELIST_EXPERIENCE_LIST_STATUS = gql`
  mutation UpdateLifeListExperienceListStatus(
    $lifeListExperienceId: ID!
    $newListStatus: String!
  ) {
    updateLifeListExperienceListStatus(
      lifeListExperienceId: $lifeListExperienceId
      newListStatus: $newListStatus
    ) {
      success
      message
    }
  }
`;

export const UPDATE_ASSOCIATED_SHOTS = gql`
  mutation UpdateAssociatedShots($lifeListExperienceId: ID!, $shotIds: [ID]) {
    updateAssociatedShots(
      lifeListExperienceId: $lifeListExperienceId
      shotIds: $shotIds
    ) {
      success
      message
    }
  }
`;

export const UPDATE_ASSOCIATED_COLLAGES = gql`
  mutation UpdateAssociatedCollages(
    $lifeListExperienceId: ID!
    $collageIds: [ID]
  ) {
    updateAssociatedCollages(
      lifeListExperienceId: $lifeListExperienceId
      collageIds: $collageIds
    ) {
      success
      message
    }
  }
`;
