const { User, InvitedFriend } = require("../../../../models/index.mjs");

// Helper function to generate a unique 8-character invite code
const generateUniqueInviteCode = async () => {
  const generateCode = () => {
    // Generate a base-36 string and take 8 characters, all in uppercase
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  let isUnique = false;
  let inviteCode = "";

  // Keep generating until a unique invite code is found
  while (!isUnique) {
    inviteCode = generateCode();
    const existingInvite = await InvitedFriend.findOne({ inviteCode });
    if (!existingInvite) {
      isUnique = true;
    }
  }

  return inviteCode;
};

const inviteFriend = async (_, { name, phoneNumber }, { user }) => {
  try {
    // 1. Generate a unique invite code for the friend
    const inviteCode = await generateUniqueInviteCode();

    // 2. Create the InvitedFriend record with the unique invite code
    const invitedFriend = new InvitedFriend({
      name,
      phoneNumber,
      inviteCode,
      status: "INVITED",
      invitedAt: new Date(),
      expiresAt: new Date(+new Date() + 72 * 60 * 60 * 1000), // 72 hours expiration
    });

    // 3. Save the invited friend record to the database
    await invitedFriend.save();

    // 4. Add the invited friend's ID to the user's invitedFriends array
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { invitedFriends: invitedFriend._id }, // Save the friend ID
      },
      { new: true }
    );

    return {
      success: true,
      message: `${name} has been successfully invited.`,
    };
  } catch (error) {
    console.error("Error inviting friend:", error);
    return {
      success: false,
      message: "Failed to invite friend. Please try again.",
    };
  }
};

export default inviteFriend;
