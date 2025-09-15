/**
 * Basic Production Readiness Tests for MobileNovin AI SDK
 * Tests the actual API as implemented
 */

const MobileNovinAI = require('../src/mobilenovin-ai.js');

describe('MobileNovin AI SDK - Basic Production Tests', () => {
  let ai;

  beforeEach(() => {
    ai = new MobileNovinAI({
      apiKey: 'test-api-key',
      brandId: 'test-brand-id',
      region: 'us-east-1'
    });
  });

  describe('Initialization', () => {
    test('should initialize with valid configuration', () => {
      expect(ai).toBeDefined();
      expect(ai.config).toBeDefined();
    });

    test('should throw error with invalid configuration', () => {
      expect(() => {
        new MobileNovinAI();
      }).toThrow();
    });
  });

  describe('Event Processing', () => {
    const validEvent = {
      entityType: 'human',
      entityId: 'camera-001-detection',
      location: 'front_door',
      timestamp: Date.now(),
      behaviors: ['walking', 'approaching'],
      detectionConfidence: 0.85,
      metadata: {
        userHome: false,
        timeOfDay: 'night',
        deviceId: 'camera-001',
        eventType: 'humanDetected'
      }
    };

    test('should process valid event with interpretEvent', async () => {
      const result = await ai.interpretEvent(validEvent);

      expect(result).toBeDefined();
      expect(result.alertLevel).toBeDefined();
      expect(['info', 'standard', 'elevated', 'critical']).toContain(result.alertLevel);
      expect(typeof result.suspicionLevel).toBe('number');
      expect(result.suspicionLevel).toBeGreaterThanOrEqual(0);
      expect(result.suspicionLevel).toBeLessThanOrEqual(1);
      expect(result.confidence).toBeDefined();
      expect(result.eventId).toBeDefined();
      expect(typeof result.processingLatency).toBe('number');
    });

    test('should handle different event types', async () => {
      const entityTypes = ['human', 'vehicle', 'animal'];

      for (const entityType of entityTypes) {
        const event = {
          ...validEvent,
          entityType,
          entityId: `${entityType}-detection-001`,
          behaviors: [entityType === 'human' ? 'walking' : entityType === 'vehicle' ? 'moving' : 'running']
        };
        const result = await ai.interpretEvent(event);
        expect(result).toBeDefined();
        expect(result.alertLevel).toBeDefined();
      }
    });

    test('should validate required fields', async () => {
      const invalidEvent = {
        entityType: 'human'
        // missing required fields: entityId, location, timestamp, behaviors
      };

      await expect(ai.interpretEvent(invalidEvent)).rejects.toThrow();
    });
  });

  describe('Batch Processing', () => {
    test('should process event sequence', async () => {
      const events = [
        {
          entityType: 'human',
          entityId: 'motion-detection-001',
          location: 'front_yard',
          timestamp: Date.now() - 3000,
          behaviors: ['moving'],
          detectionConfidence: 0.7
        },
        {
          entityType: 'human',
          entityId: 'human-detection-001',
          location: 'front_door',
          timestamp: Date.now() - 1000,
          behaviors: ['walking', 'approaching'],
          detectionConfidence: 0.9
        }
      ];

      const result = await ai.interpretEventSequence(events);

      expect(result).toBeDefined();
      expect(result.individualAssessments).toBeDefined();
      expect(result.sequenceAssessment).toBeDefined();
      expect(result.totalEvents).toBe(2);
    });

    test('should handle empty event sequence', async () => {
      await expect(ai.interpretEventSequence([])).rejects.toThrow();
    });
  });

  describe('Reasoning and Explanations', () => {
    test('should provide reasoning explanations', () => {
      const explanation = ai.explainReasoning('test-event-id');
      expect(explanation).toBeDefined();
    });

    test('should provide spatial awareness state', () => {
      const awareness = ai.getSpatialAwareness();
      expect(awareness).toBeDefined();
    });

    test('should provide contextual insights', () => {
      const insights = ai.getContextualInsights();
      expect(insights).toBeDefined();
    });
  });

  describe('Performance', () => {
    test('should process events within reasonable time', async () => {
      const event = {
        entityType: 'human',
        entityId: 'perf-test-001',
        location: 'test',
        timestamp: Date.now(),
        behaviors: ['walking'],
        detectionConfidence: 0.8
      };

      const startTime = Date.now();
      await ai.interpretEvent(event);
      const processingTime = Date.now() - startTime;

      // Should process within 100ms for production readiness
      expect(processingTime).toBeLessThan(100);
    });

    test('should handle concurrent events', async () => {
      const events = Array.from({ length: 5 }, (_, i) => ({
        entityType: 'human',
        entityId: `device-${i}-detection`,
        location: `location-${i}`,
        timestamp: Date.now(),
        behaviors: ['moving'],
        detectionConfidence: 0.7 + (i * 0.02)
      }));

      const promises = events.map(event => ai.interpretEvent(event));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.alertLevel).toBeDefined();
      });
    });

    test('should provide performance metrics', () => {
      const metrics = ai.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });
  });

  describe('Error Handling', () => {
    test('should validate input types', async () => {
      await expect(ai.interpretEvent(null)).rejects.toThrow();
      await expect(ai.interpretEvent(undefined)).rejects.toThrow();
      await expect(ai.interpretEvent('not-an-object')).rejects.toThrow();
      await expect(ai.interpretEvent(123)).rejects.toThrow();
    });

    test('should handle invalid event sequences', async () => {
      await expect(ai.interpretEventSequence('not-an-array')).rejects.toThrow();
      await expect(ai.interpretEventSequence(null)).rejects.toThrow();
    });
  });

  describe('Memory Management', () => {
    test('should not leak memory with many events', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Process many events to test for memory leaks
      for (let i = 0; i < 50; i++) {
        await ai.interpretEvent({
          entityType: 'human',
          entityId: `stress-test-${i}`,
          location: 'test',
          timestamp: Date.now(),
          behaviors: ['moving'],
          detectionConfidence: 0.8
        });
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 5MB for 50 events)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });

    test('should clear object pools', () => {
      expect(() => ai.clearObjectPools()).not.toThrow();
    });

    test('should clear cache', () => {
      expect(() => ai.clearCache()).not.toThrow();
    });
  });
});