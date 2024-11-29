import { GLView } from "expo-gl";
import { Asset } from "expo-asset";
import { shaders } from "./shaders";

export const applyFilterToImage = async (imageUri, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shaderCode = shaders[filter];
      const gl = await GLView.createContextAsync();

      // Compile and link shaders
      const program = gl.createProgram();
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

      gl.shaderSource(vertexShader, shaderCode.vertex);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(
          "Vertex shader error: " + gl.getShaderInfoLog(vertexShader)
        );
      }
      gl.shaderSource(fragmentShader, shaderCode.fragment);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(
          "Fragment shader error: " + gl.getShaderInfoLog(fragmentShader)
        );
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(
          "Shader program link error: " + gl.getProgramInfoLog(program)
        );
      }
      gl.useProgram(program);

      // Load and bind image texture
      const asset = Asset.fromURI(imageUri);
      await asset.downloadAsync();

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Flip Y-axis
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

      // Set up framebuffer
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );

      const framebufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (framebufferStatus !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(
          "Framebuffer is not complete. Status: " + framebufferStatus
        );
      }

      // Clear and draw with shader
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Capture the result
      const snapshotResult = await GLView.takeSnapshotAsync(gl, {
        format: "jpeg", // Use JPEG for smaller files
        quality: 0.8, // Adjust quality for compression
        result: "file", // Save as a file
      });

      const filteredImageUri = snapshotResult.uri || snapshotResult.localUri;
      if (!filteredImageUri) {
        throw new Error("Failed to generate filtered image URI");
      }

      // Clean up and resolve
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      resolve(filteredImageUri);
    } catch (error) {
      console.error("Error in applyFilterToImage:", error);
      reject(error);
    }
  });
};
