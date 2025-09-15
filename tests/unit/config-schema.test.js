/**
 * Tests for configuration schema and validation
 */
import { DEFAULT_CONFIG, validateConfig, mergeConfig } from '../../config-schema.js';
import { GoliathCognitiveInterpreter } from '../../mobilenovin-ai.js';

describe('Configuration Schema', () => {
  test('DEFAULT_CONFIG has all required fields', () => {
    expect(DEFAULT_CONFIG.suspicionThresholds).toBeDefined();
    expect(DEFAULT_CONFIG.confidenceThreshold).toBeDefined();
    expect(DEFAULT_CONFIG.intentWeights).toBeDefined();
    expect(DEFAULT_CONFIG.fallbackValues).toBeDefined();
    expect(DEFAULT_CONFIG.performance).toBeDefined();
    expect(DEFAULT_CONFIG.autosave).toBeDefined();
  });
  
  test('validateConfig accepts valid configuration', () => {
    const errors = validateConfig(DEFAULT_CONFIG);
    expect(errors).toEqual([]);
  });
  
  test('validateConfig rejects invalid confidenceThreshold', () => {
    const invalidConfig = { ...DEFAULT_CONFIG, confidenceThreshold: 1.5 };
    const errors = validateConfig(invalidConfig);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('confidenceThreshold');
  });
  
  test('validateConfig rejects invalid suspicionThresholds order', () => {
    const invalidConfig = { 
      ...DEFAULT_CONFIG, 
      suspicionThresholds: { info: 0.8, standard: 0.6, elevated: 0.3, critical: 0.1 }
    };
    const errors = validateConfig(invalidConfig);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('suspicionThresholds');
  });
  
  test('validateConfig rejects invalid intent weights sum', () => {
    const invalidConfig = { 
      ...DEFAULT_CONFIG, 
      intentWeights: { behavioral: 0.1, contextual: 0.1, temporal: 0.1, spatial: 0.1, classification: 0.1 }
    };
    const errors = validateConfig(invalidConfig);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('intentWeights');
  });
  
  test('validateConfig rejects invalid fallback values', () => {
    const invalidConfig = { 
      ...DEFAULT_CONFIG, 
      fallbackValues: { reliability: 1.5, confidence: -0.2 }
    };
    const errors = validateConfig(invalidConfig);
    expect(errors.length).toBeGreaterThan(0);
  });
  
  test('mergeConfig properly merges nested objects', () => {
    const customConfig = {
      suspicionThresholds: { critical: 0.9 },
      intentWeights: { behavioral: 0.4 },
      newField: 'test'
    };
    
    const merged = mergeConfig(DEFAULT_CONFIG, customConfig);
    
    expect(merged.suspicionThresholds.critical).toBe(0.9);
    expect(merged.suspicionThresholds.info).toBe(DEFAULT_CONFIG.suspicionThresholds.info);
    expect(merged.intentWeights.behavioral).toBe(0.4);
    expect(merged.intentWeights.contextual).toBe(DEFAULT_CONFIG.intentWeights.contextual);
    expect(merged.newField).toBe('test');
  });
  
  test('mergeConfig handles null/undefined user config', () => {
    expect(mergeConfig(DEFAULT_CONFIG, null)).toEqual(DEFAULT_CONFIG);
    expect(mergeConfig(DEFAULT_CONFIG, undefined)).toEqual(DEFAULT_CONFIG);
  });
  
  test('GoliathCognitiveInterpreter uses merged configuration', () => {
    const customConfig = {
      suspicionThresholds: { critical: 0.9 },
      intentWeights: { behavioral: 0.4 }
    };
    
    const interpreter = new GoliathCognitiveInterpreter(customConfig);
    
    expect(interpreter.config.suspicionThresholds.critical).toBe(0.9);
    expect(interpreter.config.suspicionThresholds.info).toBe(DEFAULT_CONFIG.suspicionThresholds.info);
    expect(interpreter.config.intentWeights.behavioral).toBe(0.4);
    expect(interpreter.config.intentWeights.contextual).toBe(DEFAULT_CONFIG.intentWeights.contextual);
  });
  
  test('GoliathCognitiveInterpreter throws on invalid configuration', () => {
    const invalidConfig = {
      confidenceThreshold: 1.5 // Invalid value
    };
    
    expect(() => {
      new GoliathCognitiveInterpreter(invalidConfig);
    }).toThrow('Configuration validation failed');
  });
});
