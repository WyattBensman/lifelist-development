import { User, InvitedFriend } from "../../../../models/index.mjs";

const updateInviteStatus = async (_, { inviteCode }) => {
  try {
    // Find the invited friend by their unique invite code
    const invitedFriend = await InvitedFriend.findOne({ inviteCode });

    if (!invitedFriend) {
      return {
        success: false,
        message: "Invite code not found.",
      };
    }

    // Check if the invite code has expired
    if (new Date() > invitedFriend.expiresAt) {
      invitedFriend.status = "EXPIRED";
      await invitedFriend.save();
      return {
        success: false,
        message: "This invite code has expired.",
      };
    }

    // Check if the invite code has already been used
    if (invitedFriend.status === "JOINED") {
      return {
        success: false,
        message: "This invite code has already been used.",
      };
    }

    // Mark the invite as joined
    invitedFriend.status = "JOINED";
    await invitedFriend.save();

    return {
      success: true,
      message: "Invite code successfully used.",
    };
  } catch (error) {
    console.error("Error updating invite status:", error);
    return {
      success: false,
      message: "Failed to update invite status. Please try again.",
    };
  }
};

export default updateInviteStatus;
