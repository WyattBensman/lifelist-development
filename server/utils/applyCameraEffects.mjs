import Jimp from "jimp";

export async function applyCameraEffects(imagePath, cameraType) {
  try {
    const image = await Jimp.read(imagePath);

    switch (cameraType) {
      case "FUJI":
        await image.contrast(0.1).sepia();
        break;

      case "DISPOSABLE":
        // Convert image to black and white using greyscale
        await image.greyscale(); // Apply greyscale filter
        break;

      case "POLAROID":
        // Apply a contrast and simulate a vignette effect manually
        await image.contrast(0.25); // Increase the contrast
        await image.circle(); // This might not be exactly vignette but gives a rounded corner effect
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
