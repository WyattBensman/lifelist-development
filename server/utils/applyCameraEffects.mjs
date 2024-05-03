import Jimp from "jimp";

export async function applyCameraEffects(imagePath, cameraType) {
  try {
    const image = await Jimp.read(imagePath);

    switch (cameraType) {
      case "FUJI":
        await image.contrast(0.1).sepia();
        break;
      case "DISPOSABLE":
        await image.blur(1).noise(10);
        break;
      case "POLAROID":
        await image.contrast(0.25).vignette(0.15, 60);
        break;
      case "STANDARD":
        // No effect for the standard camera
        break;
    }

    await image.writeAsync(imagePath); // Save the processed image
    return imagePath;
  } catch (error) {
    console.error("Error processing image with JIMP:", error);
    throw error;
  }
}
