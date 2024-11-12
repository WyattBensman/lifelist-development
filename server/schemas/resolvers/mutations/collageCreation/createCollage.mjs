import { Collage, User } from "../../../../models/index.mjs";
import { isUser } from "../../../../utils/auth.mjs";
import createNotification from "../notifications/createNotification.mjs";

const createCollage = async (_, { caption, images, taggedUsers }, { user }) => {
  try {
    isUser(user);

    console.log(`User ${user} is attempting to create a collage.`);

    // Validate that at least one image is provided
    if (!images || images.length === 0) {
      console.error("Validation Error: No images provided.");
      throw new Error("At least one image is required to create a collage.");
    }

    // Validate the number of images (1 to 12 allowed)
    if (images.length > 12) {
      console.error(
        `Validation Error: Too many images provided (${images.length}).`
      );
      throw new Error("A collage can have at most 12 images.");
    }

    // Log the images provided
    console.log(`Images provided for collage: ${images}`);

    // Directly use the provided image paths (no need to modify them)
    const imageUrls = images;

    // Create a new collage document
    const collage = new Collage({
      author: user,
      caption,
      images: imageUrls,
      tagged: taggedUsers.map((user) => user),
      posted: true,
    });

    console.log(`Creating collage document: ${JSON.stringify(collage)}`);
    await collage.save();
    console.log(`Collage created successfully with ID: ${collage._id}`);

    // Add the collage to the current user's collages
    const userUpdateResult = await User.findByIdAndUpdate(user, {
      $addToSet: { collages: collage._id },
    });
    console.log(
      `User ${user}'s collages updated: ${JSON.stringify(userUpdateResult)}`
    );

    // Send notifications to tagged users
    const taggedUserIds = taggedUsers.map((taggedUser) => taggedUser._id);
    console.log(`Tagged users: ${taggedUserIds}`);

    // Add the collage to the taggedCollages field for each tagged user
    const taggedUsersUpdateResult = await User.updateMany(
      { _id: { $in: taggedUserIds } },
      { $addToSet: { taggedCollages: collage._id } }
    );
    console.log(
      `Tagged users updated with collage ID ${collage._id}: ${JSON.stringify(
        taggedUsersUpdateResult
      )}`
    );

    for (const taggedUserId of taggedUserIds) {
      await createNotification({
        recipientId: taggedUserId,
        senderId: user,
        type: "TAG",
        message: `${user.fullName} tagged you in a collage.`,
      });
      console.log(
        `Notification sent to tagged user ${taggedUserId} from user ${user}.`
      );
    }

    console.log("Collage creation process completed successfully.");
    return {
      success: true,
      message: "Collage successfully created.",
    };
  } catch (error) {
    console.error(`Error during collage creation: ${error.message}`);
    throw new Error("An error occurred while posting the collage.");
  }
};

export default createCollage;
