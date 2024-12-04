import { gql } from "@apollo/client";

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

export const REMOVE_EXPERIENCE_FROM_LIFELIST = gql`
  mutation RemoveExperienceFromLifeList(
    $lifeListId: ID!
    $lifeListExperienceId: ID!
  ) {
    removeExperienceFromLifeList(
      lifeListId: $lifeListId
      lifeListExperienceId: $lifeListExperienceId
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
