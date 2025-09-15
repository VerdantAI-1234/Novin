/**
 * Centralized Configuration Schema for MobileNovIn AI SDK
 * Consolidates all hard-coded parameters into configurable defaults
 */

export const DEFAULT_CONFIG = {
  suspicionThresholds: {
    info: 0.15,
    standard: 0.3,
    elevated: 0.55,
    critical: 0.8
  },
  
  confidenceThreshold: 0.7,
  uncertaintyThreshold: 0.3,
  
  intentWeights: {
    behavioral: 0.3,
    contextual: 0.25,
    temporal: 0.2,
    spatial: 0.15,
    classification: 0.1
  },
  
  alertThresholds: {
    ignore: 20,
    standard: 45,
    elevated: 70,
    critical: 85
  },
  
  contextualWeights: {
    spatial: 0.3,
    temporal: 0.2,
    behavioral: 0.3,
    entity: 0.2
  },
  
  fallbackValues: {
    reliability: 0.5,
    confidence: 0.5,
    assumptionValidity: 0.7,
    standardDeviation: 0.0
  },
  
  performance: {
    processingTimeout: 5,
    memoryLimit: 128 * 1024 * 1024, // 128MB
    cacheSize: 1000,
    maxMemoryEvents: 5000
  },
  
  autosave: {
    enabled: true,
    intervalMs: 30000, // 30 seconds
    maxBackups: 5,
    compressionEnabled: true,
    checksumValidation: true,
    saveDirectory: './saves'
  }
};

export function validateConfig(config) {
  const errors = [];
  
  if (config.confidenceThreshold < 0 || config.confidenceThreshold > 1) {
    errors.push('confidenceThreshold must be between 0 and 1');
  }
  
  // Validate suspicion thresholds are in ascending order
  const s = config.suspicionThresholds;
  if (s && (s.info >= s.standard || s.standard >= s.elevated || s.elevated >= s.critical)) {
    errors.push('suspicionThresholds must be in ascending order (info < standard < elevated < critical)');
  }
  
  if (config.intentWeights) {
    const weightSum = Object.values(config.intentWeights).reduce((sum, w) => sum + w, 0);
    if (weightSum < 0.8 || weightSum > 1.2) {
      errors.push('intentWeights should sum to approximately 1.0');
    }
  }
  
  if (config.fallbackValues) {
    const fb = config.fallbackValues;
    if (fb.reliability < 0 || fb.reliability > 1) {
      errors.push('fallbackValues.reliability must be between 0 and 1');
    }
    if (fb.confidence < 0 || fb.confidence > 1) {
      errors.push('fallbackValues.confidence must be between 0 and 1');
    }
  }
  
  return errors;
}

export function mergeConfig(defaultConfig, userConfig) {
  if (!userConfig) return { ...defaultConfig };
  
  return {
    ...defaultConfig,
    ...userConfig,
    suspicionThresholds: { ...defaultConfig.suspicionThresholds, ...(userConfig.suspicionThresholds || {}) },
    intentWeights: { ...defaultConfig.intentWeights, ...(userConfig.intentWeights || {}) },
    alertThresholds: { ...defaultConfig.alertThresholds, ...(userConfig.alertThresholds || {}) },
    contextualWeights: { ...defaultConfig.contextualWeights, ...(userConfig.contextualWeights || {}) },
    fallbackValues: { ...defaultConfig.fallbackValues, ...(userConfig.fallbackValues || {}) },
    performance: { ...defaultConfig.performance, ...(userConfig.performance || {}) },
    autosave: { ...defaultConfig.autosave, ...(userConfig.autosave || {}) }
  };
}
