import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import sanitizeFilename from "sanitize-filename";

// Configure AWS
AWS.config.update({
  region: "us-east-2",
});

const s3 = new AWS.S3();

export const getPresignedUrl = async (_, { folder, fileName, fileType }) => {
  // Validate the folder
  const allowedFolders = [
    "camera-images",
    "profile-images",
    "experience-images",
  ];
  if (!allowedFolders.includes(folder)) {
    throw new Error("Invalid folder specified");
  }

  // Generate a unique and sanitized filename
  const uniqueFilename = `${uuidv4()}-${sanitizeFilename(fileName)}`;

  // Include the folder in the S3 key
  const key = `${folder}/${uniqueFilename}`;

  const params = {
    Bucket: "lifelist-media",
    Key: key,
    Expires: 300, // Default to 5 minutes
    ContentType: fileType,
  };

  try {
    // Generate the pre-signed URL
    const presignedUrl = await s3.getSignedUrlPromise("putObject", params);

    // Return the presigned URL and the file URL for later use
    return {
      presignedUrl,
      fileUrl: `${process.env.CLOUDFRONT_URL}${key}`,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error.message);
    throw new Error("Could not generate presigned URL");
  }
};
