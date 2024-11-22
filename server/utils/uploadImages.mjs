import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sanitizeFilename from "sanitize-filename";
import path from "path";
import Jimp from "jimp";

// Single image upload function
export const uploadSingleImage = async (
  { createReadStream, filename },
  uploadDir
) => {
  try {
    if (!createReadStream || !filename) {
      throw new Error(
        "Invalid image format. Expected a file with a createReadStream and filename."
      );
    }

    // Generate a unique filename to avoid conflicts
    const uniqueFilename = `${uuidv4()}-${sanitizeFilename(filename)}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Ensure the uploads directory exists
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Stream the file data to the file system
    const stream = createReadStream();
    const writeStream = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream).on("finish", resolve).on("error", reject);
    });

    return filePath;
  } catch (error) {
    console.error(`Error during single image upload: ${error.message}`);
    throw new Error("Single image upload failed");
  }
};

// Compress and resize profile picture using JIMP
export const compressProfilePicture = async (
  { createReadStream, filename },
  uploadDir
) => {
  try {
    if (!createReadStream || !filename) {
      throw new Error(
        "Invalid image format. Expected a file with a createReadStream and filename."
      );
    }

    // Generate unique filenames
    const uniqueFilename = `${uuidv4()}-${sanitizeFilename(filename)}`;
    const compressedFilePath = path.join(
      uploadDir,
      `compressed-${uniqueFilename}`
    );
    const tempFilePath = path.join(uploadDir, `temp-${uniqueFilename}`);

    // Ensure the uploads directory exists
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Save the original file temporarily
    const stream = createReadStream();
    await new Promise((resolve, reject) => {
      stream
        .pipe(fs.createWriteStream(tempFilePath))
        .on("finish", resolve)
        .on("error", reject);
    });

    // Read the file with JIMP
    const image = await Jimp.read(tempFilePath);

    // Resize and compress the image
    image.resize(200, 200); // Resize to 200x200 pixels
    image.quality(80); // Set JPEG quality to 80%
    await image.writeAsync(compressedFilePath); // Save the compressed image

    // Remove the temporary file
    await fs.promises.unlink(tempFilePath);

    return compressedFilePath; // Return the path to the compressed file
  } catch (error) {
    console.error(`Error during profile picture compression: ${error.message}`);
    throw new Error("Profile picture compression failed");
  }
};

// Multiple images upload function
export const uploadMultipleImages = async (images, uploadDir) => {
  try {
    const imageUrls = [];

    console.log("Images received for upload:", images);

    for (const image of images) {
      if (!image || !image.file) {
        throw new Error(
          "Invalid image object. Expected an object with a 'file' key."
        );
      }

      const filePath = await uploadSingleImage(image.file, uploadDir);

      // Construct the file URL using the API_URL environment variable
      const baseUrl = process.env.API_URL || "http://localhost:3001";
      const fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;

      imageUrls.push(fileUrl); // Store the generated URL
    }

    console.log("Final uploaded image URLs:", imageUrls);
    return imageUrls;
  } catch (error) {
    console.error(`Error during multiple images upload: ${error.message}`);
    throw new Error("Multiple images upload failed");
  }
};
