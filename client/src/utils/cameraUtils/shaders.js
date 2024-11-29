export const shaders = {
  Standard: {
    vertex: `
      attribute vec4 position;
      attribute vec2 texcoord;
      varying vec2 uv;

      void main() {
        gl_Position = position;
        uv = texcoord;
      }
    `,
    fragment: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D image;
      uniform float saturation;
      uniform float contrast;
      uniform float grainAmount;

      void main() {
        vec4 color = texture2D(image, uv);
        vec3 gray = vec3(0.3, 0.59, 0.11);
        vec3 desaturated = vec3(dot(color.rgb, gray));
        color.rgb = mix(desaturated, color.rgb, saturation);
        color.rgb += vec3(0.05, 0.03, 0.0);
        color.rgb = ((color.rgb - 0.5) * max(contrast, 0.0)) + 0.5;
        vec2 noiseCoords = uv * vec2(800.0, 800.0); // Grain based on texture coordinates
        float grain = fract(sin(dot(noiseCoords, vec2(12.9898, 78.233))) * 43758.5453);
        color.rgb += grainAmount * (grain - 0.5);
        gl_FragColor = color;
      }
    `,
  },
  disposableFilter: {
    vertex: `
      attribute vec4 position;
      attribute vec2 texcoord;
      varying vec2 uv;

      void main() {
        gl_Position = position;
        uv = texcoord;
      }
    `,
    fragment: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D image;
      uniform float saturation;
      uniform float contrast;
      uniform float grainAmount;

      void main() {
        vec4 color = texture2D(image, uv);
        vec3 gray = vec3(0.3, 0.59, 0.11);
        vec3 desaturated = vec3(dot(color.rgb, gray));
        color.rgb = mix(desaturated, color.rgb, saturation);
        color.rgb += vec3(0.05, 0.03, 0.0);
        color.rgb = ((color.rgb - 0.5) * max(contrast, 0.0)) + 0.5;
        color.rgb = mix(color.rgb, vec3(1.0), -0.1);
        vec2 noiseCoords = uv * vec2(800.0, 800.0); // Grain based on texture coordinates
        float grain = fract(sin(dot(noiseCoords, vec2(12.9898, 78.233))) * 43758.5453);
        color.rgb += grainAmount * (grain - 0.5);
        gl_FragColor = color;
      }
    `,
  },
  fujiFilter: {
    vertex: `
      attribute vec4 position;
      attribute vec2 texcoord;
      varying vec2 uv;

      void main() {
        gl_Position = position;
        uv = texcoord;
      }
    `,
    fragment: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D image;
      uniform float desaturation;
      uniform float contrast;
      uniform float grainAmount;

      void main() {
        vec4 color = texture2D(image, uv);
        vec2 noiseCoords = uv * vec2(800.0, 800.0);
        float grain = fract(sin(dot(noiseCoords, vec2(12.9898, 78.233))) * 43758.5453);
        color.rgb += grainAmount * (grain - 0.5);
        vec3 gray = vec3(0.3, 0.59, 0.11);
        vec3 desaturated = vec3(dot(color.rgb, gray));
        color.rgb = mix(desaturated, color.rgb, desaturation);
        color.rgb += vec3(0.1, 0.05, 0.0);
        color.rgb = ((color.rgb - 0.5) * max(contrast, 0.0)) + 0.5;
        color.rgb = mix(color.rgb, vec3(1.0), -0.2);
        gl_FragColor = color;
      }
    `,
  },
};
