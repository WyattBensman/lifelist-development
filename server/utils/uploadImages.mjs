import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sanitizeFilename from "sanitize-filename";

export const uploadSingleImage = async (image, uploadDir) => {
  try {
    const { createReadStream, filename } = await image;
    const uniqueFilename = `${uuidv4()}-${sanitizeFilename(filename)}`;

    const filePath = `${uploadDir}/${uniqueFilename}`;

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

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

export const uploadMultipleImages = async (images, uploadDir) => {
  try {
    const imagePaths = [];

    // Iterate over the array of images
    for (const image of images) {
      const imagePath = await uploadSingleImage(image, uploadDir);
      imagePaths.push(imagePath);
    }

    return imagePaths;
  } catch (error) {
    console.error(`Error during multiple image upload: ${error.message}`);
    throw new Error("Multiple image upload failed");
  }
};
