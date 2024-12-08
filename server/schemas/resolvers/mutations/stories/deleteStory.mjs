import { Story, User } from "../../../../models/index.mjs";

export const deleteStory = async (_, { storyId }, { user }) => {
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const story = await Story.findById(storyId);

    if (!story) {
      throw new Error("Story not found.");
    }

    // Ensure the user is the author of the story
    if (!story.author.equals(user)) {
      throw new Error("You can only delete your own stories.");
    }

    // Delete the story
    await story.deleteOne();

    // Remove the story reference from the user's stories array
    await User.findByIdAndUpdate(
      user,
      { $pull: { stories: storyId } }, // Remove storyId from stories array
      { new: true } // Return the updated document
    );

    return {
      success: true,
      message: "Story successfully deleted.",
    };
  } catch (error) {
    console.error("Error deleting story:", error.message);
    throw new Error("Failed to delete story.");
  }
};
