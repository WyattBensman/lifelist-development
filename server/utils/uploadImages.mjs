import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sanitizeFilename from "sanitize-filename";
import path from "path";

export const uploadSingleImage = async (image, uploadDir) => {
  try {
    const { createReadStream, filename } = await image;
    console.log(`Create Read Stream: ${createReadStream}`);
    console.log(`Filename: ${filename}`);
    const uniqueFilename = `${uuidv4()}-${sanitizeFilename(filename)}`;
    console.log(`Unique Filename: ${uniqueFilename}`);

    console.log(`Upload Dir: ${uploadDir}`);
    const filePath = path.join(uploadDir, uniqueFilename);
    console.log(`File Path: ${filePath}`);

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      console.log(`Directory does not exist. Creating directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Directory created: ${uploadDir}`);
    } else {
      console.log(`Directory exists: ${uploadDir}`);
    }

    const stream = createReadStream();
    const writeStream = fs.createWriteStream(filePath);

    console.log("Starting to write the file...");
    await new Promise((resolve, reject) => {
      stream
        .pipe(writeStream)
        .on("finish", () => {
          console.log("File write finished successfully.");
          resolve();
        })
        .on("error", (error) => {
          console.error(`Error during file write: ${error.message}`);
          reject(error);
        });
    });

    console.log(`File successfully saved at: ${filePath}`);
    return filePath;
  } catch (error) {
    console.error(`Error during single image upload: ${error.message}`);
    throw new Error("Single image upload failed");
  }
};

export const uploadMultipleImages = async (images, uploadDir) => {
  try {
    const imageUrls = [];

    for (const image of images) {
      const filePath = await uploadSingleImage(image.file, uploadDir);
      // Construct the file URL
      const baseUrl = process.env.PORT ? "" : "http://localhost:3001";
      const fileUrl = `${baseUrl}/uploads/${filePath.split("/").pop()}`;

      imageUrls.push(fileUrl);
    }

    return imageUrls;
  } catch (error) {
    console.error(`Error during multiple images upload: ${error.message}`);
    throw new Error("Multiple images upload failed");
  }
};
