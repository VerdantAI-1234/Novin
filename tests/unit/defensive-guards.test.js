/**
 * Unit tests for defensive guards against divide-by-zero and NaN
 */
import { IntentModelingFramework } from '../../intent-modeling-framework.js';
import { SpatialTemporalAwareness } from '../../spatial-temporal-awareness.js';
import { ConfidenceExplainer } from '../../explainable-reasoning-system.js';

describe('Defensive Guards', () => {
  describe('IntentModelingFramework._calculateReliability', () => {
    let framework;
    
    beforeEach(() => {
      framework = new IntentModelingFramework({});
    });
    
    test('handles empty factors object', () => {
      const result = framework._calculateReliability({});
      expect(result).toBe(0.5);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles null/undefined factors', () => {
      expect(framework._calculateReliability(null)).toBe(0.5);
      expect(framework._calculateReliability(undefined)).toBe(0.5);
    });
    
    test('handles single factor', () => {
      const result = framework._calculateReliability({ factor1: 0.8 });
      expect(result).toBe(1.0); // No variance with single value
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles normal case with multiple factors', () => {
      const result = framework._calculateReliability({ 
        factor1: 0.8, 
        factor2: 0.7, 
        factor3: 0.9 
      });
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles factors with NaN values', () => {
      const result = framework._calculateReliability({ 
        factor1: 0.8, 
        factor2: NaN, 
        factor3: 0.9 
      });
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });
  });
  
  describe('SpatialTemporalAwareness._calculateStandardDeviation', () => {
    let awareness;
    
    beforeEach(() => {
      awareness = new SpatialTemporalAwareness({});
    });
    
    test('handles empty array', () => {
      const result = awareness._calculateStandardDeviation([]);
      expect(result).toBe(0);
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles null/undefined values', () => {
      expect(awareness._calculateStandardDeviation(null)).toBe(0);
      expect(awareness._calculateStandardDeviation(undefined)).toBe(0);
    });
    
    test('handles single value', () => {
      const result = awareness._calculateStandardDeviation([5]);
      expect(result).toBe(0);
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles normal case', () => {
      const result = awareness._calculateStandardDeviation([1, 2, 3, 4, 5]);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles array with NaN values', () => {
      const result = awareness._calculateStandardDeviation([1, NaN, 3, 4, 5]);
      expect(typeof result).toBe('number');
      expect(isNaN(result)).toBe(false);
    });
  });
  
  describe('ConfidenceExplainer._assessAssumptionValidity', () => {
    let explainer;
    
    beforeEach(() => {
      explainer = new ConfidenceExplainer();
    });
    
    test('handles empty assumptions array', () => {
      const result = explainer._assessAssumptionValidity([]);
      expect(result).toBe(0.7);
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles null/undefined assumptions', () => {
      expect(explainer._assessAssumptionValidity(null)).toBe(0.7);
      expect(explainer._assessAssumptionValidity(undefined)).toBe(0.7);
    });
    
    test('handles assumptions with invalid confidence values', () => {
      const assumptions = [
        { confidence: NaN },
        { confidence: 'invalid' },
        { confidence: null }
      ];
      const result = explainer._assessAssumptionValidity(assumptions);
      expect(result).toBe(0.5); // Fallback when no valid confidences
      expect(isNaN(result)).toBe(false);
    });
    
    test('handles mixed valid and invalid assumptions', () => {
      const assumptions = [
        { confidence: 0.8 },
        { confidence: NaN },
        { confidence: 0.6 },
        { confidence: 'invalid' }
      ];
      const result = explainer._assessAssumptionValidity(assumptions);
      expect(result).toBe(0.7); // Average of 0.8 and 0.6
      expect(isNaN(result)).toBe(false);
    });
    
    test('clamps result to [0,1] range', () => {
      const assumptions = [
        { confidence: 1.5 }, // Out of range
        { confidence: -0.2 } // Out of range
      ];
      const result = explainer._assessAssumptionValidity(assumptions);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
      expect(isNaN(result)).toBe(false);
    });
  });
});
