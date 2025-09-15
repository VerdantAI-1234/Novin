/**
 * Comprehensive Test Suite for MobileNovin AI SDK
 * Production readiness validation
 */

const MobileNovinAI = require('../src/mobilenovin-ai.js');

describe('MobileNovin AI SDK - Production Tests', () => {
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
      expect(ai.config.apiKey).toBe('test-api-key');
      expect(ai.config.brandId).toBe('test-brand-id');
    });

    test('should throw error with invalid configuration', () => {
      expect(() => {
        new MobileNovinAI();
      }).toThrow();

      expect(() => {
        new MobileNovinAI({});
      }).toThrow();
    });

    test('should set default configuration values', () => {
      const aiDefault = new MobileNovinAI({
        apiKey: 'test',
        brandId: 'test'
      });
      expect(aiDefault.config.region).toBe('us-east-1');
    });
  });

  describe('Event Processing', () => {
    const validEvent = {
      deviceId: 'camera-001',
      eventType: 'humanDetected',
      location: 'front_door',
      confidence: 0.85,
      timestamp: Date.now(),
      metadata: {
        userHome: false,
        timeOfDay: 'night'
      }
    };

    test('should process valid event', async () => {
      const result = await ai.interpretEvent(validEvent);

      expect(result).toBeDefined();
      expect(result.alertLevel).toBeDefined();
      expect(['info', 'standard', 'elevated', 'critical']).toContain(result.alertLevel);
      expect(result.message).toBeDefined();
      expect(typeof result.threatScore).toBe('number');
      expect(result.threatScore).toBeGreaterThanOrEqual(0);
      expect(result.threatScore).toBeLessThanOrEqual(100);
      expect(result.confidence).toBeDefined();
      expect(result.eventId).toBeDefined();
      expect(typeof result.processingTime).toBe('number');
    });

    test('should handle missing required fields', async () => {
      const invalidEvent = {
        deviceId: 'camera-001'
        // missing eventType, location, confidence
      };

      await expect(ai.interpretEvent(invalidEvent)).rejects.toThrow();
    });

    test('should validate confidence range', async () => {
      const invalidConfidenceEvent = {
        ...validEvent,
        confidence: 1.5 // invalid confidence > 1.0
      };

      await expect(ai.interpretEvent(invalidConfidenceEvent)).rejects.toThrow();
    });

    test('should handle different event types', async () => {
      const eventTypes = ['motion', 'humanDetected', 'doorOpened', 'doorClosed', 'glassBreak'];

      for (const eventType of eventTypes) {
        const event = { ...validEvent, eventType };
        const result = await ai.interpretEvent(event);
        expect(result).toBeDefined();
        expect(result.alertLevel).toBeDefined();
      }
    });

    test('should consider contextual metadata', async () => {
      const homeEvent = { ...validEvent, metadata: { userHome: true, timeOfDay: 'day' } };
      const awayEvent = { ...validEvent, metadata: { userHome: false, timeOfDay: 'night' } };

      const homeResult = await ai.interpretEvent(homeEvent);
      const awayResult = await ai.interpretEvent(awayEvent);

      // Away events at night should generally have higher threat scores
      expect(homeResult).toBeDefined();
      expect(awayResult).toBeDefined();
    });
  });

  describe('Batch Processing', () => {
    test('should process event sequence', async () => {
      const events = [
        {
          deviceId: 'sensor-001',
          eventType: 'motion',
          location: 'front_yard',
          confidence: 0.7,
          timestamp: Date.now() - 3000
        },
        {
          deviceId: 'camera-001',
          eventType: 'humanDetected',
          location: 'front_door',
          confidence: 0.9,
          timestamp: Date.now() - 1000
        },
        {
          deviceId: 'door-001',
          eventType: 'doorOpened',
          location: 'front_door',
          confidence: 1.0,
          timestamp: Date.now()
        }
      ];

      const result = await ai.interpretEventSequence(events);

      expect(result).toBeDefined();
      expect(result.individualAssessments).toHaveLength(3);
      expect(result.sequenceAssessment).toBeDefined();
      expect(result.totalEvents).toBe(3);
    });

    test('should handle empty event sequence', async () => {
      await expect(ai.interpretEventSequence([])).rejects.toThrow();
    });

    test('should handle non-array input', async () => {
      await expect(ai.interpretEventSequence('not-an-array')).rejects.toThrow();
    });
  });

  describe('Configuration Management', () => {
    test('should set brand configuration', async () => {
      const brandConfig = {
        brandName: 'TestBrand',
        alertThresholds: {
          ignore: 20,
          standard: 45,
          elevated: 70,
          critical: 85
        },
        contextWeights: {
          userPresence: 1.8,
          timeOfDay: 1.4,
          location: 1.3,
          weather: 0.5
        },
        whiteLabel: true
      };

      await expect(ai.setBrandConfiguration(brandConfig)).resolves.not.toThrow();
    });

    test('should validate brand configuration', async () => {
      const invalidConfig = {
        alertThresholds: {
          ignore: 100, // invalid: ignore threshold too high
          standard: 45,
          elevated: 70,
          critical: 85
        }
      };

      await expect(ai.setBrandConfiguration(invalidConfig)).rejects.toThrow();
    });
  });

  describe('Analytics', () => {
    test('should retrieve analytics', async () => {
      const analytics = await ai.getAnalytics('7d');
      expect(analytics).toBeDefined();
      expect(typeof analytics).toBe('object');
    });

    test('should handle invalid time range', async () => {
      await expect(ai.getAnalytics('invalid-range')).rejects.toThrow();
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
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate network error by using invalid configuration
      const aiWithBadConfig = new MobileNovinAI({
        apiKey: 'invalid-key',
        brandId: 'invalid-brand',
        endpoint: 'https://invalid-endpoint.example.com'
      });

      const event = {
        deviceId: 'test-device',
        eventType: 'motion',
        location: 'test-location',
        confidence: 0.8
      };

      // Should not throw but should handle error gracefully
      const result = await aiWithBadConfig.processEvent(event);
      expect(result).toBeDefined();
    });

    test('should validate input types', async () => {
      await expect(ai.processEvent(null)).rejects.toThrow();
      await expect(ai.processEvent(undefined)).rejects.toThrow();
      await expect(ai.processEvent('not-an-object')).rejects.toThrow();
      await expect(ai.processEvent(123)).rejects.toThrow();
    });
  });

  describe('Performance', () => {
    test('should process events within reasonable time', async () => {
      const event = {
        deviceId: 'perf-test',
        eventType: 'humanDetected',
        location: 'test',
        confidence: 0.8
      };

      const startTime = Date.now();
      await ai.processEvent(event);
      const processingTime = Date.now() - startTime;

      // Should process within 100ms for production readiness
      expect(processingTime).toBeLessThan(100);
    });

    test('should handle concurrent events', async () => {
      const events = Array.from({ length: 10 }, (_, i) => ({
        deviceId: `device-${i}`,
        eventType: 'motion',
        location: `location-${i}`,
        confidence: 0.7 + (i * 0.02)
      }));

      const promises = events.map(event => ai.processEvent(event));
      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.alertLevel).toBeDefined();
      });
    });
  });

  describe('Memory Management', () => {
    test('should not leak memory with many events', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Process many events to test for memory leaks
      for (let i = 0; i < 100; i++) {
        await ai.processEvent({
          deviceId: `stress-test-${i}`,
          eventType: 'motion',
          location: 'test',
          confidence: 0.8
        });
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB for 100 events)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });
});