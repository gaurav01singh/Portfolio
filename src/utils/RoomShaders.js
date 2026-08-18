import { Filter } from "pixi.js";

export function createSkillsShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;
      uniform float uIntensity;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Subtle plasma energy distortion
        float wave = sin(uv.y * 18.0 + uTime * 2.5) * 0.0025 + cos(uv.x * 12.0 - uTime * 1.8) * 0.0025;
        vec2 distUv = uv + vec2(wave, wave * 0.5);
        
        vec4 color = texture(uTexture, distUv);
        
        // Cyberpunk energy pulse (cyan & gold tint)
        float pulse = sin(uTime * 1.5 + (uv.x + uv.y) * 4.0) * 0.5 + 0.5;
        vec3 energyGlow = vec3(0.0, 0.4, 0.6) * pulse * 0.12 * uIntensity;
        
        // Subtle horizontal energy scan flux
        float scan = sin(uv.y * 220.0 + uTime * 6.0) * 0.03 * uIntensity;
        
        finalColor = vec4(color.rgb + energyGlow + scan * color.rgb, color.a);
      }
    `;

    const filter = Filter.from({
      gl: { fragment },
      resources: {
        filterUniforms: {
          uTime: { value: 0.0, type: "f32" },
          uIntensity: { value: 1.0, type: "f32" },
        },
      },
    });

    return filter;
  } catch (err) {
    console.warn("Skills shader initialization fallback:", err);
    return null;
  }
}

// 2. EXPERIENCE ROOM — Holographic Laser Timeline Shader
export function createExperienceShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Holographic horizontal raster lines
        float scanline = sin(uv.y * 320.0 + uTime * 4.0) * 0.04;
        
        // Subtle RGB chromatic split
        float r = texture(uTexture, uv + vec2(0.0018 * sin(uTime * 2.0), 0.0)).r;
        float g = texture(uTexture, uv).g;
        float b = texture(uTexture, uv - vec2(0.0018 * cos(uTime * 2.0), 0.0)).b;
        float a = texture(uTexture, uv).a;
        
        // Hologram laser shimmer
        float beam = smoothstep(0.48, 0.52, sin(uv.y * 3.0 - uTime * 1.2) * 0.5 + 0.5) * 0.08;
        vec3 holoTint = vec3(1.0, 0.35, 0.35) * beam;
        
        finalColor = vec4(vec3(r, g, b) + scanline + holoTint, a);
      }
    `;

    const filter = Filter.from({
      gl: { fragment },
      resources: {
        filterUniforms: {
          uTime: { value: 0.0, type: "f32" },
        },
      },
    });

    return filter;
  } catch (err) {
    console.warn("Experience shader fallback:", err);
    return null;
  }
}

// 3. EDUCATION ROOM — Ethereal Knowledge Celestial Nebula Shader
export function createEducationShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Ethereal cosmic breathing wave
        float breath = sin(uTime * 0.8 + (uv.x - uv.y) * 3.0) * 0.5 + 0.5;
        vec4 color = texture(uTexture, uv);
        
        // Violet & celestial gold luminescence
        vec3 celestialGlow = vec3(0.35, 0.2, 0.6) * breath * 0.14;
        
        // Delicate starlight shimmer
        float twinkle = sin(uv.x * 60.0 + uTime * 2.0) * sin(uv.y * 60.0 - uTime * 1.5) * 0.03;
        
        finalColor = vec4(color.rgb + celestialGlow + twinkle, color.a);
      }
    `;

    const filter = Filter.from({
      gl: { fragment },
      resources: {
        filterUniforms: {
          uTime: { value: 0.0, type: "f32" },
        },
      },
    });

    return filter;
  } catch (err) {
    console.warn("Education shader fallback:", err);
    return null;
  }
}

// 4. PROJECTS ROOM — Retro CRT Phosphor Arcade Shader
export function createProjectsShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // CRT screen subtle curvature warp
        vec2 center = uv - 0.5;
        float dist = dot(center, center);
        vec2 crtUv = uv + center * dist * 0.035;
        
        // Subtle RGB shadow-mask separation
        float r = texture(uTexture, crtUv + vec2(0.0012, 0.0)).r;
        float g = texture(uTexture, crtUv).g;
        float b = texture(uTexture, crtUv - vec2(0.0012, 0.0)).b;
        float a = texture(uTexture, crtUv).a;
        
        // Rolling CRT cathode scanline beam
        float scanline = sin(crtUv.y * 360.0 + uTime * 5.0) * 0.045;
        
        // Corner vignette
        float vig = (1.0 - dist * 1.2);
        
        vec3 rgb = (vec3(r, g, b) + scanline) * max(0.65, vig);
        
        finalColor = vec4(rgb, a);
      }
    `;

    const filter = Filter.from({
      gl: { fragment },
      resources: {
        filterUniforms: {
          uTime: { value: 0.0, type: "f32" },
        },
      },
    });

    return filter;
  } catch (err) {
    console.warn("Projects shader fallback:", err);
    return null;
  }
}

// 5. ABOUT ROOM — Cinematic Warm Ambient Studio Shader
export function createAboutShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        vec4 color = texture(uTexture, uv);
        
        // Gentle warm amber studio ambient pulse
        float glow = sin(uTime * 0.7 + uv.x * 2.0) * 0.5 + 0.5;
        vec3 warmBloom = vec3(0.12, 0.08, 0.02) * glow;
        
        // Film micro-vignette
        vec2 center = uv - 0.5;
        float vig = 1.0 - dot(center, center) * 0.35;
        
        finalColor = vec4((color.rgb + warmBloom) * vig, color.a);
      }
    `;

    const filter = Filter.from({
      gl: { fragment },
      resources: {
        filterUniforms: {
          uTime: { value: 0.0, type: "f32" },
        },
      },
    });

    return filter;
  } catch (err) {
    console.warn("About shader fallback:", err);
    return null;
  }
}

// 6. CONTACT ROOM — Sunset Vaporwave Twilight Mirage Shader
export function createContactShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Twilight skyline atmospheric heat ripple
        float heat = sin(uv.y * 24.0 + uTime * 2.0) * 0.0018;
        vec4 color = texture(uTexture, uv + vec2(heat, 0.0));
        
        // Sunset pink/rose evening shimmer
        float sunsetGlow = sin(uTime * 1.1 + uv.y * 3.0) * 0.5 + 0.5;
        vec3 twilightTint = vec3(0.2, 0.06, 0.15) * sunsetGlow * 0.12;
        
        finalColor = vec4(color.rgb + twilightTint, color.a);
      }
    `;

    const filter = Filter.from({
      gl: { fragment },
      resources: {
        filterUniforms: {
          uTime: { value: 0.0, type: "f32" },
        },
      },
    });

    return filter;
  } catch (err) {
    console.warn("Contact shader fallback:", err);
    return null;
  }
}
