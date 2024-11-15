import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sanitizeFilename from "sanitize-filename";
import path from "path";
import sharp from "sharp";

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
    await fs.promises.mkdir(uploadDir, { recursive: true }); // Use promises for mkdir

    // Stream the file data to the file system
    const stream = createReadStream();
    const writeStream = fs.createWriteStream(filePath); // Use standard fs.createWriteStream

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream).on("finish", resolve).on("error", reject);
    });

    return filePath;
  } catch (error) {
    console.error(`Error during single image upload: ${error.message}`);
    throw new Error("Single image upload failed");
  }
};

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

    // Generate a unique filename to avoid conflicts
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

    // Compress and resize the image
    await sharp(tempFilePath)
      .resize(200, 200) // Resize to 200x200 pixels
      .jpeg({ quality: 80 }) // Compress to 80% quality
      .toFile(compressedFilePath);

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

    console.log("Images received for upload:", images); // Log the received images

    for (const image of images) {
      // Ensure that each image object contains a 'file' key with a valid format
      if (!image || !image.file) {
        throw new Error(
          "Invalid image object. Expected an object with a 'file' key."
        );
      }

      const filePath = await uploadSingleImage(image.file, uploadDir); // Pass the correct file object to uploadSingleImage

      // Construct the file URL using the API_URL environment variable
      const baseUrl = process.env.API_URL || "http://localhost:3001";
      const fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`; // Generate the full URL for the uploaded file

      imageUrls.push(fileUrl); // Store the generated URL
    }

    console.log("Final uploaded image URLs:", imageUrls); // Log the final uploaded URLs
    return imageUrls; // Return the list of uploaded image URLs
  } catch (error) {
    console.error(`Error during multiple images upload: ${error.message}`);
    throw new Error("Multiple images upload failed");
  }
};
