/**
 * Central Configuration System
 * Moves hard-coded weights and thresholds to configurable values
 */

export default class NovinConfig {
  constructor(customConfig = {}) {
    // Default configuration with sane defaults
    this.config = {
      // Suspicion thresholds
      suspicion: {
        lowThreshold: 0.3,
        mediumThreshold: 0.6,
        highThreshold: 0.8,
        baselineThreat: 0.1,
        ...customConfig.suspicion
      },

      // Confidence thresholds
      confidence: {
        lowThreshold: 0.4,
        mediumThreshold: 0.7,
        highThreshold: 0.9,
        neutralScore: 0.5,
        ...customConfig.confidence
      },

      // Intent modeling weights
      intentWeights: {
        behavioral: 0.3,
        contextual: 0.25,
        temporal: 0.2,
        spatial: 0.15,
        classification: 0.1,
        ...customConfig.intentWeights
      },

      // Memory system weights
      memoryWeights: {
        spatial: 0.3,
        temporal: 0.2,
        behavioral: 0.3,
        entity: 0.2,
        ...customConfig.memoryWeights
      },

      // Suspicion calculation weights
      suspicionWeights: {
        behavioral: 0.3,
        spatial: 0.2,
        temporal: 0.2,
        historical: 0.15,
        environmental: 0.15,
        ...customConfig.suspicionWeights
      },

      // Time-based suspicion modifiers
      timeModifiers: {
        nightHours: 0.3,         // 22:00-06:00
        earlyLateHours: 0.1,     // 18:00-22:00, 06:00-08:00
        weekendBonus: 0.2,
        baseTimeScore: 0.3,
        ...customConfig.timeModifiers
      },

      // Risk level mappings
      riskLevels: {
        highRisk: 0.1,
        lowRisk: -0.05,
        defaultAdjustment: 0,
        ...customConfig.riskLevels
      },

      // Explainability thresholds
      explainability: {
        clarityThreshold: 0.7,
        completenessThreshold: 0.7,
        highClarityThreshold: 0.8,
        minTraceDepth: 5,
        minEvidenceCount: 3,
        mediumTraceDepth: 3,
        mediumEvidenceCount: 2,
        ...customConfig.explainability
      },

      // Variance and agreement thresholds
      variance: {
        maxAgreementVariance: 0.2,
        uncertaintyThreshold: 0.7,
        mediumUncertaintyThreshold: 0.6,
        lowUncertaintyThreshold: 0.4,
        ...customConfig.variance
      }
    };
  }

  /**
   * Get configuration value by path (e.g., 'suspicion.lowThreshold')
   */
  get(path) {
    return this._getNestedValue(this.config, path);
  }

  /**
   * Set configuration value by path
   */
  set(path, value) {
    this._setNestedValue(this.config, path, value);
  }

  /**
   * Update multiple configuration values
   */
  update(updates) {
    this.config = this._deepMerge(this.config, updates);
  }

  /**
   * Get all configuration as read-only object
   */
  getAll() {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Validate configuration values
   */
  validate() {
    const errors = [];
    
    // Validate suspicion thresholds are in order
    const s = this.config.suspicion;
    if (s.lowThreshold >= s.mediumThreshold || s.mediumThreshold >= s.highThreshold) {
      errors.push('Suspicion thresholds must be in ascending order');
    }

    // Validate weights sum to reasonable values
    const intentWeights = Object.values(this.config.intentWeights);
    const intentSum = intentWeights.reduce((sum, w) => sum + w, 0);
    if (Math.abs(intentSum - 1.0) > 0.1) {
      errors.push(`Intent weights sum to ${intentSum.toFixed(2)}, should be close to 1.0`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Helper to get nested value from object
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Helper to set nested value in object
   */
  _setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Deep merge objects
   */
  _deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
}

/**
 * Simple tuning endpoint for configuration updates
 */
export class ConfigTuner {
  constructor(config) {
    this.config = config;
  }

  /**
   * Tune suspicion sensitivity
   */
  tuneSuspicionSensitivity(level) {
    const multiplier = level === 'high' ? 0.8 : level === 'low' ? 1.2 : 1.0;
    this.config.update({
      suspicion: {
        lowThreshold: 0.3 * multiplier,
        mediumThreshold: 0.6 * multiplier,
        highThreshold: 0.8 * multiplier
      }
    });
  }

  /**
   * Tune confidence requirements
   */
  tuneConfidenceRequirements(level) {
    const thresholds = level === 'strict' ? 
      { lowThreshold: 0.6, mediumThreshold: 0.8, highThreshold: 0.95 } :
      level === 'relaxed' ? 
      { lowThreshold: 0.3, mediumThreshold: 0.6, highThreshold: 0.8 } :
      { lowThreshold: 0.4, mediumThreshold: 0.7, highThreshold: 0.9 };
    
    this.config.update({ confidence: thresholds });
  }

  /**
   * Apply preset configuration
   */
  applyPreset(presetName) {
    const presets = {
      'production': {
        suspicion: { lowThreshold: 0.4, mediumThreshold: 0.7, highThreshold: 0.85 },
        confidence: { lowThreshold: 0.5, mediumThreshold: 0.75, highThreshold: 0.9 }
      },
      'development': {
        suspicion: { lowThreshold: 0.2, mediumThreshold: 0.5, highThreshold: 0.75 },
        confidence: { lowThreshold: 0.3, mediumThreshold: 0.6, highThreshold: 0.8 }
      },
      'high-security': {
        suspicion: { lowThreshold: 0.15, mediumThreshold: 0.4, highThreshold: 0.7 },
        confidence: { lowThreshold: 0.6, mediumThreshold: 0.8, highThreshold: 0.95 }
      }
    };

    if (presets[presetName]) {
      this.config.update(presets[presetName]);
    }
  }
}