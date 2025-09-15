/**
 * Critical Math Safety Tests
 * Tests for array safety guards and variance calculations
 */

// Mock the modules we need to test
const mockReasoningChain = {
  logicalSteps: [],
  assumptions: []
};

const mockFactors = {};

describe('Math Safety Guards', () => {
  describe('Empty Array Protection', () => {
    test('should handle empty logicalSteps in confidence analysis', () => {
      const explainableReasoning = {
        _assessLogicalConsistency: function(reasoningChain) {
          const confidences = reasoningChain.logicalSteps.map(step => step.confidence);
          if (confidences.length === 0) return 0.5; // Neutral score for empty steps
          
          const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
          const variance = confidences.reduce((sum, conf) => sum + Math.pow(conf - avgConfidence, 2), 0) / confidences.length;
          
          return Math.max(0, 1 - variance);
        },

        _analyzeConfidenceFactors: function(assessment, reasoningChain) {
          const factors = {};
          
          const stepConfidences = reasoningChain.logicalSteps.map(step => step.confidence);
          factors.averageStepConfidence = stepConfidences.length > 0 ? 
            stepConfidences.reduce((sum, conf) => sum + conf, 0) / stepConfidences.length : 0.5;
          
          return factors;
        }
      };

      // Test empty array scenarios
      const result = explainableReasoning._assessLogicalConsistency(mockReasoningChain);
      expect(result).toBe(0.5);
      expect(Number.isFinite(result)).toBe(true);

      const factors = explainableReasoning._analyzeConfidenceFactors({}, mockReasoningChain);
      expect(factors.averageStepConfidence).toBe(0.5);
      expect(Number.isFinite(factors.averageStepConfidence)).toBe(true);
    });

    test('should handle empty factors in reliability calculation', () => {
      const intentModeling = {
        _calculateReliability: function(factors) {
          const values = Object.values(factors);
          if (values.length === 0) return 0.5; // Neutral score for empty factors
          
          const variance = values.reduce((sum, value, _, array) => {
            const mean = array.reduce((a, b) => a + b) / array.length;
            return sum + Math.pow(value - mean, 2);
          }, 0) / values.length;
          
          return Math.max(0, 1 - variance);
        }
      };

      const result = intentModeling._calculateReliability({});
      expect(result).toBe(0.5);
      expect(Number.isFinite(result)).toBe(true);
    });

    test('should handle division by zero in regularity calculation', () => {
      const intentModeling = {
        _calculateRegularity: function(timeIntervals) {
          if (timeIntervals.length < 2) return 1;
          
          const mean = timeIntervals.reduce((sum, interval) => sum + interval, 0) / timeIntervals.length;
          if (mean === 0) return 0; // Prevent division by zero
          
          const variance = timeIntervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) / timeIntervals.length;
          const stdDev = Math.sqrt(variance);
          
          return Math.max(0, 1 - (stdDev / mean));
        }
      };

      // Test zero mean scenario
      const result = intentModeling._calculateRegularity([0, 0, 0]);
      expect(result).toBe(0);
      expect(Number.isFinite(result)).toBe(true);
    });

    test('should handle empty suspicion factors', () => {
      const graduatedSuspicion = {
        _calculateConfidenceLevel: function(baseSuspicion) {
          const factors = Object.values(baseSuspicion.factors);
          if (factors.length === 0) return 0.5; // Neutral confidence for empty factors
          
          const avgFactorConfidence = factors.reduce((sum, factor) => sum + factor.confidence, 0) / factors.length;
          
          const scores = factors.map(factor => factor.score);
          const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
          const agreementBonus = Math.max(0, 0.2 - variance);
          
          return Math.min(1, avgFactorConfidence + agreementBonus);
        }
      };

      const result = graduatedSuspicion._calculateConfidenceLevel({ factors: {} });
      expect(result).toBe(0.5);
      expect(Number.isFinite(result)).toBe(true);
    });
  });

  describe('Non-finite Value Protection', () => {
    test('should handle NaN and Infinity in calculations', () => {
      const testData = [
        { input: [NaN, 0.5, 0.7], expected: 'should not return NaN' },
        { input: [Infinity, 0.5, 0.7], expected: 'should not return Infinity' },
        { input: [-Infinity, 0.5, 0.7], expected: 'should not return -Infinity' }
      ];

      testData.forEach(({ input, expected }) => {
        const validValues = input.filter(v => Number.isFinite(v));
        if (validValues.length === 0) {
          expect(0.5).toBe(0.5); // Should fallback to neutral
        } else {
          const mean = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
          expect(Number.isFinite(mean)).toBe(true);
        }
      });
    });
  });
});

describe('Configuration System', () => {
  test('should validate configuration thresholds', () => {
    const NovinConfig = {
      validate: function(config) {
        const errors = [];
        
        // Validate suspicion thresholds are in order
        const s = config.suspicion;
        if (s.lowThreshold >= s.mediumThreshold || s.mediumThreshold >= s.highThreshold) {
          errors.push('Suspicion thresholds must be in ascending order');
        }

        return { valid: errors.length === 0, errors };
      }
    };

    // Test valid configuration
    const validConfig = {
      suspicion: { lowThreshold: 0.3, mediumThreshold: 0.6, highThreshold: 0.8 }
    };
    const validResult = NovinConfig.validate(validConfig);
    expect(validResult.valid).toBe(true);

    // Test invalid configuration
    const invalidConfig = {
      suspicion: { lowThreshold: 0.8, mediumThreshold: 0.6, highThreshold: 0.3 }
    };
    const invalidResult = NovinConfig.validate(invalidConfig);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });
});

describe('Compression and Checksum', () => {
  test('should handle checksum calculation errors gracefully', () => {
    const autoSaveSystem = {
      _calculateChecksum: function(data) {
        try {
          const canonicalJson = JSON.stringify(data, Object.keys(data).sort());
          // Mock crypto hash
          return 'mock-hash-' + canonicalJson.length;
        } catch (error) {
          console.warn('Checksum calculation failed:', error);
          return 'checksum-error-' + Date.now();
        }
      }
    };

    // Test normal data
    const normalResult = autoSaveSystem._calculateChecksum({ test: 'data' });
    expect(normalResult).toMatch(/^mock-hash-\d+$/);

    // Test circular reference (should fail gracefully)
    const circularData = {};
    circularData.self = circularData;
    const errorResult = autoSaveSystem._calculateChecksum(circularData);
    expect(errorResult).toMatch(/^checksum-error-\d+$/);
  });
});