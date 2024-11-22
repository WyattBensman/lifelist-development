import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import sanitizeFilename from "sanitize-filename";
import Jimp from "jimp";
import mime from "mime-types";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

// Configure AWS SDK
AWS.config.update({
  region: process.env.S3_REGION,
});

const s3 = new AWS.S3();

// Helper function to create a buffer from a ReadStream
const createBufferFromStream = async (createReadStream) => {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    const stream = createReadStream();
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

// Fetches an image stream from an S3 URL
export const fetchS3ImageStream = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from S3: ${response.statusText}`);
    }
    return response.body;
  } catch (error) {
    console.error(`Error fetching S3 image (${imageUrl}): ${error.message}`);
    throw new Error("Unable to fetch image from S3.");
  }
};

// Unified S3 upload function with optional resizing
const uploadImageToS3 = async (
  { createReadStream, filename },
  folder,
  resizeOptions = null
) => {
  if (!createReadStream || !filename) {
    throw new Error(
      "Invalid input: createReadStream and filename are required."
    );
  }

  // Generate a unique filename and determine content type
  const uniqueFilename = `${uuidv4()}-${sanitizeFilename(filename)}`;
  const key = `${folder}/${uniqueFilename}`;
  const contentType = mime.lookup(filename) || "application/octet-stream";

  // Create buffer from stream
  const tempFileBuffer = await createBufferFromStream(createReadStream);

  // Resize the image if options are provided
  let finalBuffer = tempFileBuffer;
  if (resizeOptions) {
    const image = await Jimp.read(tempFileBuffer);
    if (resizeOptions.width && resizeOptions.height) {
      image.resize(resizeOptions.width, resizeOptions.height); // Resize with fixed dimensions
    } else if (resizeOptions.width) {
      image.resize(resizeOptions.width, Jimp.AUTO); // Resize with aspect ratio maintained
    }
    image.quality(80); // Compress to 80% quality
    finalBuffer = await image.getBufferAsync(Jimp.MIME_JPEG); // Convert to JPEG buffer
  }

  // Upload the processed buffer to S3
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: finalBuffer,
    ContentType: contentType,
    ACL: "public-read",
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully to S3: ${key}`);
    return `${process.env.CLOUDFRONT_URL}/${key}`;
  } catch (error) {
    console.error(`Error uploading file to S3 (${key}): ${error.message}`);
    throw new Error("File upload to S3 failed.");
  }
};

// Exported helper functions

// Upload camera images (normal or thumbnail)
export const uploadCameraImageToS3 = async (
  file,
  folder = "camera-images",
  resizeOptions = null // Optional resizing for thumbnails
) => {
  return await uploadImageToS3(file, folder, resizeOptions);
};

// Upload profile images (fixed resizing to 200x200 pixels)
export const uploadProfileImageToS3 = async (
  file,
  folder = "profile-images"
) => {
  return await uploadImageToS3(file, folder, { width: 200, height: 200 });
};

// Upload experience images (fixed resizing to 450 height x 300 width)
export const uploadExperienceImageToS3 = async (
  file,
  folder = "experience-images"
) => {
  return await uploadImageToS3(file, folder, { width: 300, height: 450 });
};

// Delete a file from S3
export const deleteImageFromS3 = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`Image deleted successfully from S3: ${key}`);
  } catch (error) {
    console.error(`Error deleting image from S3 (${key}): ${error.message}`);
    throw new Error("Image deletion from S3 failed.");
  }
};

// Deletes an old profile picture from S3 if it exists and is not the default.
export const deleteOldProfilePicture = async (profilePictureUrl) => {
  if (
    profilePictureUrl &&
    profilePictureUrl.includes(process.env.CLOUDFRONT_URL) && // Ensure it's a valid CloudFront URL
    !profilePictureUrl.includes("default-avatar.jpg") // Skip default
  ) {
    try {
      const oldKey = profilePictureUrl
        .split(process.env.CLOUDFRONT_URL)[1]
        .substring(1); // Extract S3 key
      await deleteImageFromS3(oldKey);
      console.log(`Old profile picture deleted: ${oldKey}`);
    } catch (error) {
      console.error(
        `Failed to delete old profile picture (${profilePictureUrl}): ${error.message}`
      );
    }
  } else {
    console.log("No valid profile picture to delete.");
  }
};
