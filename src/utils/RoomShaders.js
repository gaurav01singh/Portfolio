import { Filter } from "pixi.js";

// 1. SKILLS ROOM — Alpine Mountain Pass & Sunlight Shader
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
        
        // Subtle alpine breeze wave ripple
        float wave = sin(uv.y * 14.0 + uTime * 1.8) * 0.0012 + cos(uv.x * 10.0 - uTime * 1.4) * 0.0008;
        vec2 distUv = uv + vec2(wave, wave * 0.5);
        
        vec4 color = texture(uTexture, distUv);
        
        // Mountain morning sunlight & amber warmth pulse
        float pulse = sin(uTime * 1.0 + (uv.x + uv.y) * 2.5) * 0.5 + 0.5;
        vec3 sunGlow = vec3(0.12, 0.08, 0.03) * pulse * 0.15 * uIntensity;
        
        // Subtle atmospheric starlight shimmer
        float shimmer = sin(uv.x * 40.0 + uTime * 2.0) * sin(uv.y * 30.0 - uTime * 1.5) * 0.02 * (1.0 - uv.y);
        
        // Delicate vignette
        vec2 center = uv - 0.5;
        float vig = 1.0 - dot(center, center) * 0.22;
        
        finalColor = vec4((color.rgb + sunGlow + shimmer) * vig, color.a);
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
    console.warn("Skills mountain shader initialization fallback:", err);
    return null;
  }
}

// 2. EXPERIENCE ROOM — Ocean Water Horizon & Tropical Caustics Shader
export function createExperienceShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Ocean surface gentle heat and wave refractive ripple
        float wave = sin(uv.y * 18.0 + uTime * 2.2) * 0.0015 + cos(uv.x * 14.0 - uTime * 1.5) * 0.001;
        vec2 waterUv = uv + vec2(wave, wave * 0.5);
        
        vec4 color = texture(uTexture, waterUv);
        
        // Tropical sunlight caustics and aquatic turquoise shimmer
        float caustics = sin(uv.x * 35.0 + uTime * 2.5) * sin(uv.y * 25.0 - uTime * 1.8) * 0.035 * smoothstep(0.3, 0.8, uv.y);
        vec3 sunGlow = vec3(0.04, 0.14, 0.2) * (sin(uTime * 1.2 + uv.x * 3.0) * 0.5 + 0.5) * 0.2;
        
        // Soft vignette
        vec2 center = uv - 0.5;
        float vig = 1.0 - dot(center, center) * 0.2;
        
        finalColor = vec4((color.rgb + caustics + sunGlow) * vig, color.a);
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
    console.warn("Experience ocean shader fallback:", err);
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

// 4. PROJECTS ROOM — Alpine Mountain Twilight Atmosphere Shader
export function createProjectsShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Gentle mountain breeze / atmospheric heat ripple
        float breeze = sin(uv.y * 14.0 + uTime * 1.6) * 0.0012 + cos(uv.x * 10.0 - uTime * 1.2) * 0.0008;
        vec2 distUv = uv + vec2(breeze, breeze * 0.4);
        
        vec4 color = texture(uTexture, distUv);
        
        // Soft twilight mountain horizon ambient pulse (celestial blue & warm twilight peach)
        float pulse = sin(uTime * 0.9 + (uv.y * 2.0)) * 0.5 + 0.5;
        vec3 twilightGlow = vec3(0.05, 0.12, 0.22) * pulse * (1.0 - uv.y) * 0.25;
        
        // Soft subtle starlight & summit crest shimmer
        float crestShimmer = sin(uv.x * 40.0 + uTime * 2.0) * sin(uv.y * 30.0 - uTime * 1.5) * 0.02 * (1.0 - uv.y);
        
        // Delicate atmospheric vignette
        vec2 center = uv - 0.5;
        float vig = 1.0 - dot(center, center) * 0.22;
        
        finalColor = vec4((color.rgb + twilightGlow + crestShimmer) * vig, color.a);
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
    console.warn("Projects mountain shader fallback:", err);
    return null;
  }
}

// 5. ABOUT ROOM — Cosmic Stargazer Nebula & Starlight Shader
export function createAboutShader() {
  try {
    const fragment = `
      in vec2 vTextureCoord;
      out vec4 finalColor;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Interstellar cosmic gravitational wave distortion
        float spaceWave = sin(uv.y * 12.0 + uTime * 1.5) * 0.0012 + cos(uv.x * 10.0 - uTime * 1.1) * 0.0008;
        vec2 distUv = uv + vec2(spaceWave, spaceWave * 0.5);
        
        vec4 color = texture(uTexture, distUv);
        
        // Deep space cosmic nebula pulse (starlight indigo & celestial violet)
        float nebulaPulse = sin(uTime * 0.8 + (uv.x + uv.y) * 2.0) * 0.5 + 0.5;
        vec3 nebulaGlow = vec3(0.04, 0.06, 0.16) * nebulaPulse * (1.0 - uv.y * 0.5);
        
        // Distant twinkling star field shimmer
        float starShimmer = sin(uv.x * 60.0 + uTime * 3.0) * sin(uv.y * 50.0 - uTime * 2.0) * 0.025;
        
        // Soft cosmic vignette
        vec2 center = uv - 0.5;
        float vig = 1.0 - dot(center, center) * 0.28;
        
        finalColor = vec4((color.rgb + nebulaGlow + starShimmer) * vig, color.a);
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
    console.warn("About cosmic shader fallback:", err);
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
