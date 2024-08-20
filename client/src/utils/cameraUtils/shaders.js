import { Shaders, Node, GLSL } from "gl-react";

export const shaders = Shaders.create({
  standardFilter: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D image;

      void main () {
        vec4 color = texture2D(image, uv);

        // Increase saturation
        float saturation = 1.3;
        vec3 gray = vec3(0.3, 0.59, 0.11);
        vec3 desaturated = vec3(dot(color.rgb, gray));
        color.rgb = mix(desaturated, color.rgb, saturation);
        
        // Apply warm tint
        color.rgb += vec3(0.05, 0.03, 0.0);
        
        // Increase contrast
        float contrast = 1.2;
        color.rgb = ((color.rgb - 0.5) * max(contrast, 0.0)) + 0.5;
        
        // Slight overexposure
        color.rgb += vec3(0.05, 0.05, 0.05);
        
        // Subtle grain effect
        float grainAmount = 0.02;
        vec2 noiseCoords = gl_FragCoord.xy / vec2(500.0, 500.0);
        float grain = fract(sin(dot(noiseCoords, vec2(12.9898, 78.233))) * 43758.5453);
        color.rgb += grainAmount * (grain - 0.5);
        
        gl_FragColor = color;
      }
    `,
  },
  disposableFilter: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D image;

      void main () {
        vec4 color = texture2D(image, uv);
        
        // Increase saturation
        float saturation = 1.2;
        vec3 gray = vec3(0.3, 0.59, 0.11);
        vec3 desaturated = vec3(dot(color.rgb, gray));
        color.rgb = mix(desaturated, color.rgb, saturation);
        
        // Apply warm tint
        color.rgb += vec3(0.05, 0.03, 0.0);
        
        // Increase contrast
        float contrast = 1.3;
        color.rgb = ((color.rgb - 0.5) * max(contrast, 0.0)) + 0.5;
        
        // Soften highlights
        color.rgb = mix(color.rgb, vec3(1.0), -0.1);
        
        // Apply subtle grain
        float grainAmount = 0.02;
        vec2 noiseCoords = gl_FragCoord.xy / vec2(500.0, 500.0);
        float grain = fract(sin(dot(noiseCoords, vec2(12.9898, 78.233))) * 43758.5453);
        color.rgb += grainAmount * (grain - 0.5);
        
        gl_FragColor = color;
      }
    `,
  },
  fujiFilter: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D image;

      void main () {
        vec4 color = texture2D(image, uv);
        
        // Apply grain effect
        float grainAmount = 0.05;
        vec2 noiseCoords = gl_FragCoord.xy / vec2(800.0, 800.0);
        float grain = fract(sin(dot(noiseCoords, vec2(12.9898, 78.233))) * 43758.5453);
        color.rgb += grainAmount * (grain - 0.5);
        
        // Muted colors (desaturation)
        float desaturation = 0.5;
        vec3 gray = vec3(0.3, 0.59, 0.11);
        vec3 desaturated = vec3(dot(color.rgb, gray));
        color.rgb = mix(desaturated, color.rgb, desaturation);
        
        // Warm tint
        color.rgb += vec3(0.1, 0.05, 0.0);
        
        // Increase contrast
        float contrast = 1.4;
        color.rgb = ((color.rgb - 0.5) * max(contrast, 0.0)) + 0.5;
        
        // Soften highlights
        color.rgb = mix(color.rgb, vec3(1.0), -0.2);
        
        gl_FragColor = color;
      }
    `,
  },
});
