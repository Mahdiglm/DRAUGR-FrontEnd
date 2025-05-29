/**
 * Advanced Hover Effects System
 * 
 * A comprehensive system for dynamic cursor-velocity based hover effects
 * with performance optimization and randomization capabilities.
 */

// Velocity thresholds (pixels per millisecond)
export const VELOCITY_THRESHOLDS = {
  SLOW: 0.2,     // 0-0.2 px/ms: Subtle effects
  MEDIUM: 0.5,   // 0.2-0.5 px/ms: Standard effects
  FAST: 1.0,     // 0.5-1.0 px/ms: Dramatic effects
  EXTREME: 2.0   // 1.0+ px/ms: Extreme effects
};

// Base effect intensity multipliers
export const INTENSITY_MULTIPLIERS = {
  SLOW: 1,
  MEDIUM: 1.5,
  FAST: 2.2,
  EXTREME: 3
};

// Color palettes for different effects
export const COLOR_PALETTES = {
  NEON: ['#ff00ff', '#00ffff', '#ff3377', '#33ff77', '#7733ff'],
  FIRE: ['#ff4400', '#ff7700', '#ffaa00', '#ffdd00', '#ff2200'],
  ICE: ['#00ccff', '#0088ff', '#0044ff', '#aaddff', '#ccffff'],
  TOXIC: ['#aaff00', '#88ff00', '#66ff44', '#33cc33', '#00ff99'],
  SHADOW: ['#9900ff', '#7700ff', '#5500ff', '#3300ff', '#6600cc'],
  BLOOD: ['#cc0000', '#aa0000', '#880000', '#660000', '#ff0000'],
  GOLD: ['#ffcc00', '#ffbb00', '#ffaa00', '#ff9900', '#ff8800']
};

// Duration ranges for animations (ms)
export const DURATION_RANGES = {
  SLOW: { min: 300, max: 600 },
  MEDIUM: { min: 200, max: 400 },
  FAST: { min: 100, max: 300 },
  EXTREME: { min: 50, max: 150 }
};

// Effect types available in the system
export const EFFECT_TYPES = {
  SCALE: 'scale',
  GLOW: 'glow',
  COLOR_SHIFT: 'colorShift',
  PARTICLES: 'particles',
  DISTORTION: 'distortion',
  TEXT_EFFECT: 'textEffect',
  MORPHING: 'morphing'
};

// Particle configurations for different speeds
export const PARTICLE_CONFIGS = {
  SLOW: {
    count: { min: 1, max: 3 },
    size: { min: 1, max: 3 },
    speed: { min: 0.5, max: 1 },
    lifetime: { min: 300, max: 600 }
  },
  MEDIUM: {
    count: { min: 3, max: 8 },
    size: { min: 2, max: 4 },
    speed: { min: 1, max: 2 },
    lifetime: { min: 200, max: 500 }
  },
  FAST: {
    count: { min: 8, max: 15 },
    size: { min: 2, max: 5 },
    speed: { min: 2, max: 4 },
    lifetime: { min: 200, max: 400 }
  },
  EXTREME: {
    count: { min: 15, max: 30 },
    size: { min: 3, max: 6 },
    speed: { min: 3, max: 6 },
    lifetime: { min: 150, max: 300 }
  }
};

/**
 * Calculate cursor velocity based on position changes and time elapsed
 * @param {Object} currentPos - Current cursor position {x, y}
 * @param {Object} previousPos - Previous cursor position {x, y, time}
 * @returns {Object} Velocity data {speed, direction, speedTier}
 */
export const calculateVelocity = (currentPos, previousPos) => {
  const now = Date.now();
  const timeDelta = now - previousPos.time;
  
  // Skip calculation if time difference is too small to avoid division by zero
  if (timeDelta < 5) {
    return { 
      speed: 0, 
      direction: { x: 0, y: 0 },
      speedTier: 'SLOW',
      time: now
    };
  }
  
  const dx = currentPos.x - previousPos.x;
  const dy = currentPos.y - previousPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = distance / timeDelta; // pixels per millisecond
  
  // Normalize direction vector
  const direction = {
    x: distance > 0 ? dx / distance : 0,
    y: distance > 0 ? dy / distance : 0
  };
  
  // Determine speed tier
  let speedTier = 'SLOW';
  if (speed >= VELOCITY_THRESHOLDS.EXTREME) {
    speedTier = 'EXTREME';
  } else if (speed >= VELOCITY_THRESHOLDS.FAST) {
    speedTier = 'FAST';
  } else if (speed >= VELOCITY_THRESHOLDS.MEDIUM) {
    speedTier = 'MEDIUM';
  }
  
  return { speed, direction, speedTier, time: now };
};

/**
 * Get randomized effect parameters based on velocity
 * @param {String} speedTier - The speed tier (SLOW, MEDIUM, FAST, EXTREME)
 * @returns {Object} Randomized effect parameters
 */
export const getRandomEffectParams = (speedTier) => {
  // Base intensity based on speed tier
  const baseIntensity = INTENSITY_MULTIPLIERS[speedTier];
  
  // Add randomization factor for FAST and EXTREME speeds
  const randomizationFactor = speedTier === 'FAST' ? 0.5 : 
                              speedTier === 'EXTREME' ? 1.0 : 0.1;
  
  const intensityVariation = (Math.random() * 2 - 1) * randomizationFactor;
  const intensity = Math.max(0.1, baseIntensity + intensityVariation);
  
  // Select random color palette for faster movements
  const palettes = Object.keys(COLOR_PALETTES);
  const paletteKey = speedTier === 'SLOW' ? 'NEON' : 
                     palettes[Math.floor(Math.random() * palettes.length)];
  const colorPalette = COLOR_PALETTES[paletteKey];
  
  // Random color from the palette
  const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  
  // Animation duration (faster for higher speeds)
  const durationRange = DURATION_RANGES[speedTier];
  const duration = Math.floor(
    durationRange.min + Math.random() * (durationRange.max - durationRange.min)
  );
  
  // Particle settings
  const particleConfig = PARTICLE_CONFIGS[speedTier];
  const particleCount = Math.floor(
    particleConfig.count.min + Math.random() * (particleConfig.count.max - particleConfig.count.min)
  );
  
  // Determine which effects to enable based on speed
  const enabledEffects = [];
  
  // Slow speed gets basic effects
  enabledEffects.push(EFFECT_TYPES.SCALE, EFFECT_TYPES.GLOW);
  
  // Medium speed adds color shifts
  if (speedTier === 'MEDIUM' || speedTier === 'FAST' || speedTier === 'EXTREME') {
    enabledEffects.push(EFFECT_TYPES.COLOR_SHIFT);
  }
  
  // Fast speed adds particles
  if (speedTier === 'FAST' || speedTier === 'EXTREME') {
    enabledEffects.push(EFFECT_TYPES.PARTICLES);
  }
  
  // Extreme speed adds everything
  if (speedTier === 'EXTREME') {
    enabledEffects.push(
      EFFECT_TYPES.DISTORTION,
      EFFECT_TYPES.TEXT_EFFECT,
      EFFECT_TYPES.MORPHING
    );
  }
  
  return {
    intensity,
    color,
    colorPalette,
    duration,
    particleCount,
    enabledEffects,
    speedTier
  };
};

/**
 * Create CSS styles for the effect
 * @param {Object} effectParams - The effect parameters
 * @param {String} effectType - The type of effect to generate
 * @returns {Object} CSS styles object
 */
export const generateEffectStyles = (effectParams, effectType) => {
  const { intensity, color, colorPalette, speedTier } = effectParams;
  const styles = {};
  
  switch (effectType) {
    case EFFECT_TYPES.SCALE:
      // Scale effect increases with intensity
      styles.transform = `scale(${1 + (intensity * 0.15)})`;
      styles.transition = `transform ${effectParams.duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      break;
      
    case EFFECT_TYPES.GLOW:
      // Glow intensity and color based on speed
      const blurRadius = 5 + (intensity * 15);
      const spreadRadius = 0 + (intensity * 5);
      const colorIntensity = Math.min(0.7 + (intensity * 0.3), 1);
      styles.boxShadow = `0 0 ${blurRadius}px ${spreadRadius}px ${color}${Math.floor(colorIntensity * 255).toString(16).padStart(2, '0')}`;
      break;
      
    case EFFECT_TYPES.COLOR_SHIFT:
      // Color shift for border or accent elements
      const colorIndex = Math.floor(Math.random() * colorPalette.length);
      const secondaryColor = colorPalette[(colorIndex + 1) % colorPalette.length];
      styles.borderColor = color;
      styles.background = speedTier === 'EXTREME' ? 
        `linear-gradient(45deg, ${color}, ${secondaryColor})` : 
        'transparent';
      styles.backgroundClip = speedTier === 'EXTREME' ? 'text' : 'border-box';
      styles.WebkitBackgroundClip = speedTier === 'EXTREME' ? 'text' : 'border-box';
      styles.WebkitTextFillColor = speedTier === 'EXTREME' ? 'transparent' : 'inherit';
      break;
      
    case EFFECT_TYPES.DISTORTION:
      // Apply subtle distortion effect for extreme speeds
      if (speedTier === 'EXTREME') {
        const skewX = (Math.random() * 2 - 1) * 5 * intensity;
        const skewY = (Math.random() * 2 - 1) * 5 * intensity;
        styles.transform = `${styles.transform || ''} skew(${skewX}deg, ${skewY}deg)`;
      }
      break;
      
    default:
      break;
  }
  
  return styles;
};

/**
 * Generate particle effect data
 * @param {Object} params - Effect parameters
 * @param {Object} velocity - Velocity data
 * @returns {Array} Array of particle data objects
 */
export const generateParticles = (params, velocity) => {
  const { particleCount, speedTier } = params;
  const { direction } = velocity;
  const config = PARTICLE_CONFIGS[speedTier];
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    // Create particle with random attributes
    const size = config.size.min + Math.random() * (config.size.max - config.size.min);
    const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
    const lifetime = config.lifetime.min + Math.random() * (config.lifetime.max - config.lifetime.min);
    
    // Randomize direction slightly from cursor direction
    const spreadFactor = 0.3;
    const spreadX = (Math.random() * 2 - 1) * spreadFactor;
    const spreadY = (Math.random() * 2 - 1) * spreadFactor;
    
    // Use cursor direction vector plus spread
    const dirX = direction.x + spreadX;
    const dirY = direction.y + spreadY;
    
    // Normalize direction
    const dirMagnitude = Math.sqrt(dirX * dirX + dirY * dirY);
    const normalizedDirX = dirMagnitude > 0 ? dirX / dirMagnitude : Math.random() * 2 - 1;
    const normalizedDirY = dirMagnitude > 0 ? dirY / dirMagnitude : Math.random() * 2 - 1;
    
    // Pick a color from the palette
    const colorIndex = Math.floor(Math.random() * params.colorPalette.length);
    const color = params.colorPalette[colorIndex];
    
    particles.push({
      id: `particle-${Date.now()}-${i}`,
      size,
      speed,
      color,
      directionX: normalizedDirX,
      directionY: normalizedDirY,
      lifetime,
      createdAt: Date.now(),
      x: 0, // Will be set relative to element
      y: 0  // Will be set relative to element
    });
  }
  
  return particles;
};

/**
 * Clean up old particles
 * @param {Array} particles - Current particles array
 * @returns {Array} Filtered particles array with expired particles removed
 */
export const cleanupParticles = (particles) => {
  const now = Date.now();
  return particles.filter(particle => {
    return now - particle.createdAt < particle.lifetime;
  });
};

/**
 * Update particle positions for animation
 * @param {Array} particles - Particles to update
 * @param {Number} deltaTime - Time elapsed since last update (ms)
 * @returns {Array} Updated particles array
 */
export const updateParticles = (particles, deltaTime) => {
  return particles.map(particle => {
    // Scale deltaTime to seconds for easier calculations
    const dtSeconds = deltaTime / 1000;
    const distancePerFrame = particle.speed * 100 * dtSeconds; // 100 is a scaling factor
    
    return {
      ...particle,
      x: particle.x + (particle.directionX * distancePerFrame),
      y: particle.y + (particle.directionY * distancePerFrame)
    };
  });
};

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {Number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

/**
 * Throttle function to limit how often a function is called
 * @param {Function} func - Function to throttle
 * @param {Number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}; 