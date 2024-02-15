import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../../../models/index.mjs";

export const setProfilePictureAndBio = async (
  _,
  { userId, profilePicture, bio }
) => {
  try {
    let fileUrl = null;

    if (profilePicture) {
      // Handle file upload
      const { createReadStream, filename } = await profilePicture.file;

      // Create a unique filename using uuid
      const uniqueFilename = `${uuidv4()}-${filename}`;

      // Create the uploads directory if it doesn't exist
      const uploadDir = "./uploads";

      // Stream the file to the uploads directory
      const stream = createReadStream();
      const filePath = `${uploadDir}/${uniqueFilename}`;
      const writeStream = fs.createWriteStream(filePath);
      await stream.pipe(writeStream);

      // Store the URL or identifier of the uploaded file in the database
      // Dynamically construct the base URL based on the environment
      const baseUrl = process.env.PORT ? "" : "http://localhost:3001";
      fileUrl = `${baseUrl}/uploads/${uniqueFilename}`;
    }

    // Update the user's profile picture and bio
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture: fileUrl,
        bio,
      },
      { new: true, runValidators: true }
    );

    return updatedUser;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("An error occurred during profile update.");
  }
};
