import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const uploadImages = async (images) => {
  const fileUrls = [];

  if (!images || !Array.isArray(images)) {
    return fileUrls;
  }

  const uploadDir = "./uploads";

  for (const image of images) {
    const { createReadStream, filename } = await image.file;
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const stream = createReadStream();
    const filePath = `${uploadDir}/${uniqueFilename}`;
    const writeStream = fs.createWriteStream(filePath);
    await stream.pipe(writeStream);

    const baseUrl = process.env.PORT ? "" : "http://localhost:3001";
    const fileUrl = `${baseUrl}/uploads/${uniqueFilename}`;
    fileUrls.push(fileUrl);
  }

  return fileUrls;
};
