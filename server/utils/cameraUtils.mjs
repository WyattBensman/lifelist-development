import sharp from "sharp";

export const apply35mmFilter = async (inputPath, outputPath) => {
  try {
    // Read the input image
    const image = sharp(inputPath);

    // Apply the filter
    await image
      .modulate({
        brightness: 1.2, // Adjust brightness
        saturation: 0.8, // Adjust saturation
        hue: 20, // Adjust hue
      })
      .noise({
        amount: 30, // Add noise for grainy effect
        type: "gaussian", // Type of noise
      })
      .toFile(outputPath);

    console.log("Filter applied successfully!");
  } catch (error) {
    console.error("Error applying filter:", error);
    throw new Error("An error occurred during image filtering.");
  }
};

// Example usage
const inputPath = "path/to/your/input/image.jpg";
const outputPath = "path/to/your/output/image_filtered.jpg";

apply35mmFilter(inputPath, outputPath);
