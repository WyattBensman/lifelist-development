import { Story } from "../../../../models/index.mjs";

export const markStoryAsViewed = async (_, { storyId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const story = await Story.findById(storyId);

    if (!story) {
      throw new Error("Story not found.");
    }

    if (!story.views.includes(user)) {
      story.views.push(user);
      await story.save();
    }

    return true;
  } catch (error) {
    console.error("Error marking story as viewed:", error.message);
    throw new Error("Failed to mark story as viewed.");
  }
};
