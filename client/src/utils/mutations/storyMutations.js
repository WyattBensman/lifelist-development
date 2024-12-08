import { gql } from "@apollo/client";

export const POST_STORY = gql`
  mutation PostStory($cameraShotId: ID!) {
    postStory(cameraShotId: $cameraShotId) {
      success
      message
    }
  }
`;

export const DELETE_STORY = gql`
  mutation DeleteStory($storyId: ID!) {
    deleteStory(storyId: $storyId) {
      success
      message
    }
  }
`;

export const MARK_STORY_AS_VIEWED = gql`
  mutation MarkStoryAsViewed($storyId: ID!) {
    markStoryAsViewed(storyId: $storyId) {
      success
      message
    }
  }
`;
