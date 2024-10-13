import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import sanitizeFilename from "sanitize-filename";
import path from "path";

// Single image upload function
export const uploadSingleImage = async (image, uploadDir) => {
  try {
    const { createReadStream, filename } = await image;

    // Log to check the structure of the incoming image object
    console.log("Image details:", { createReadStream, filename });

    if (!createReadStream || !filename) {
      throw new Error(
        "Invalid image format. Expected a file with a createReadStream and filename."
      );
    }

    const uniqueFilename = `${uuidv4()}-${sanitizeFilename(filename)}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Ensure the uploads directory exists (async/await approach)
    await fs.mkdir(uploadDir, { recursive: true });

    console.log(`Uploading to path: ${filePath}`); // Log the file path

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
