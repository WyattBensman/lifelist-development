import { GLView } from "expo-gl";
import { Asset } from "expo-asset";
import { Dimensions } from "react-native";
import { shaders } from "./shaders"; // Import your shader filters

export const applyFilterToImage = async (imageUri, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting applyFilterToImage...");
      console.log("Image URI:", imageUri);
      console.log("Selected Filter:", filter);

      // Get screen width to maintain 3:2 aspect ratio
      const screenWidth = Dimensions.get("window").width;
      const imageHeight = screenWidth * 1.5; // Maintain 3:2 aspect ratio
      console.log("Screen dimensions: ", { screenWidth, imageHeight });

      // Create a headless context (offscreen rendering)
      const glView = await GLView.createContextAsync(); // Create headless context
      console.log("Headless GLView context created");

      const shaderCode = shaders[filter]; // Get the correct shader based on filterType
      console.log("Shader code loaded for filter:", filter);

      const handleContextCreate = async (gl) => {
        try {
          console.log("WebGL context created");

          // Create WebGL program and link shaders
          const program = gl.createProgram();
          const vertexShader = gl.createShader(gl.VERTEX_SHADER);
          gl.shaderSource(vertexShader, shaderCode.vertex);
          gl.compileShader(vertexShader);
          gl.attachShader(program, vertexShader);

          const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
          gl.shaderSource(fragmentShader, shaderCode.fragment);
          gl.compileShader(fragmentShader);
          gl.attachShader(program, fragmentShader);

          gl.linkProgram(program);
          gl.useProgram(program);

          // Load image into WebGL as texture
          const asset = Asset.fromURI(imageUri);
          await asset.downloadAsync();
          const texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            asset
          );

          // Create a framebuffer and bind it
          const framebuffer = gl.createFramebuffer();
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
          console.log("Framebuffer created and bound");

          // Attach the texture to the framebuffer
          gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            texture,
            0
          );
          if (
            gl.checkFramebufferStatus(gl.FRAMEBUFFER) !==
            gl.FRAMEBUFFER_COMPLETE
          ) {
            throw new Error("Framebuffer is not complete");
          }
          console.log("Framebuffer is complete");

          // Clear and draw the scene with the applied shader filter
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          console.log("Scene cleared and shader applied");

          // Capture the filtered image as a file (PNG format)
          const snapshotResult = await GLView.takeSnapshotAsync(glView, {
            format: "png",
            quality: 1,
            result: "file",
          });

          // Log the entire snapshot result for debugging
          console.log("Snapshot result:", JSON.stringify(snapshotResult));

          // Extract the correct URI from the snapshot result
          const filteredImageUri =
            snapshotResult.uri || snapshotResult.localUri;
          console.log("Filtered Image URI:", filteredImageUri);

          // Unbind the framebuffer
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);

          // Log the correct URI that will be resolved
          console.log(`HEYYYYY: ${filteredImageUri}`);

          // Return the filtered image URI, not the entire object
          resolve(filteredImageUri);
        } catch (error) {
          console.error("Error inside WebGL context creation:", error);
          reject(error); // Handle any errors during filtering
        }
      };

      // Call the context handler manually since there's no rendered GLView
      await handleContextCreate(glView);
    } catch (error) {
      console.error("Error initializing applyFilterToImage:", error);
      reject(error); // Handle any initialization errors
    }
  });
};
