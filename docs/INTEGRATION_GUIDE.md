# MobileNovin AI SDK - Integration Guide

## Quick Start (5 Minutes)

### 1. Install the SDK

```bash
# NPM
npm install @mobilenovin/ai-sdk

# Yarn
yarn add @mobilenovin/ai-sdk

# CDN (Browser)
<script src="https://cdn.mobilenovin.ai/sdk/v1/mobilenovin-ai.min.js"></script>
```

### 2. Initialize the SDK

```javascript
const MobileNovinAI = require('@mobilenovin/ai-sdk');

const ai = new MobileNovinAI({
  apiKey: 'your-api-key',
  brandId: 'your-brand-id',
  region: 'us-east-1'
});
```

### 3. Process Your First Event

```javascript
const decision = await ai.processEvent({
  deviceId: 'sensor-001',
  eventType: 'motion',
  location: 'front_door',
  confidence: 0.8,
  metadata: {
    userHome: false,
    timeOfDay: 'night'
  }
});

console.log(`Alert Level: ${decision.alertLevel}`);
console.log(`Message: ${decision.message}`);
// Output: Alert Level: CRITICAL
//         Message: Motion detected with high confidence
```

## Platform-Specific Integration

### Ring Integration

```javascript
const RingApi = require('ring-client-api').RingApi;
const MobileNovinAI = require('@mobilenovin/ai-sdk');

class RingAIIntegration {
  constructor(ringToken, mobilenovinKey) {
    this.ring = new RingApi({ refreshToken: ringToken });
    this.ai = new MobileNovinAI({
      apiKey: mobilenovinKey,
      brandId: 'ring-integration'
    });
  }

  async setupDevices() {
    const locations = await this.ring.getLocations();
    
    for (const location of locations) {
      // Setup cameras
      location.cameras.forEach(camera => {
        camera.onMotionDetected = async (motion) => {
          const decision = await this.ai.processEvent({
            deviceId: camera.id.toString(),
            eventType: 'motion',
            location: this.mapLocation(camera.location),
            confidence: this.calculateConfidence(motion),
            metadata: {
              userHome: location.mode === 'disarmed',
              timeOfDay: this.getTimeOfDay(),
              hasSnapshot: motion.hasSnapshot
            }
          });
          
          if (decision.alertLevel !== 'IGNORE') {
            await this.sendRingAlert(camera, decision);
          }
        };
      });
    }
  }
}
```

### Google Nest Integration

```javascript
const { GoogleAuth } = require('google-auth-library');
const MobileNovinAI = require('@mobilenovin/ai-sdk');

class NestAIIntegration {
  constructor(nestCredentials, mobilenovinKey) {
    this.auth = new GoogleAuth(nestCredentials);
    this.ai = new MobileNovinAI({
      apiKey: mobilenovinKey,
      brandId: 'nest-integration'
    });
  }

  async setupEventHandlers() {
    // Subscribe to Nest events
    const subscription = await this.subscribeToEvents();
    
    subscription.on('event', async (event) => {
      const decision = await this.ai.processEvent({
        deviceId: event.device_id,
        eventType: this.mapNestEventType(event.event_type),
        location: event.room_name,
        confidence: event.confidence || 0.8,
        metadata: {
          userHome: await this.getNestHomeStatus(),
          timeOfDay: this.getTimeOfDay(),
          nestEventData: event
        }
      });
      
      await this.handleNestAlert(event, decision);
    });
  }
}
```

### ADT Integration

```javascript
const MobileNovinAI = require('@mobilenovin/ai-sdk');

class ADTAIIntegration {
  constructor(adtApi, mobilenovinKey) {
    this.adt = adtApi;
    this.ai = new MobileNovinAI({
      apiKey: mobilenovinKey,
      brandId: 'adt-integration'
    });
  }

  async enhanceADTPanel() {
    // Override ADT's alarm logic with AI
    this.adt.onSensorEvent = async (sensor, event) => {
      const decision = await this.ai.processEvent({
        deviceId: sensor.id,
        eventType: this.mapADTEventType(event.type),
        location: sensor.zone,
        confidence: this.calculateADTConfidence(event),
        metadata: {
          userHome: !this.adt.isArmed(),
          timeOfDay: this.getTimeOfDay(),
          sensorType: sensor.type,
          batteryLevel: sensor.battery
        }
      });
      
      // Override traditional alarm logic
      if (decision.alertLevel === 'CRITICAL') {
        this.adt.triggerAlarm(decision.message);
      } else if (decision.alertLevel === 'IGNORE') {
        this.adt.suppressAlert(sensor.id);
      }
    };
  }
}
```

## Advanced Configuration

### Brand Customization

```javascript
// Configure AI for your brand's needs
await ai.setBrandConfiguration({
  brandName: 'SecureTech Pro',
  
  // Custom alert thresholds
  alertThresholds: {
    ignore: 20,      // More sensitive
    standard: 45,
    elevated: 70,
    critical: 85
  },
  
  // Adjust context weights
  contextWeights: {
    userPresence: 2.0,  // Higher weight for home/away
    timeOfDay: 1.2,     // Lower weight for time
    location: 1.5,      // Higher weight for location
    weather: 0.4        // Lower weight for weather
  },
  
  // Custom messaging
  customMessages: {
    'CRITICAL': 'SecureTech Alert: {original}',
    'ELEVATED': 'SecureTech Notice: {original}',
    'STANDARD': 'SecureTech Update: {original}',
    'IGNORE': null
  },
  
  // White-label mode
  whiteLabel: true
});
```

### Batch Processing

```javascript
// Process multiple events efficiently
const events = [
  { deviceId: 'sensor-1', eventType: 'motion', location: 'hallway', confidence: 0.7 },
  { deviceId: 'sensor-2', eventType: 'doorOpened', location: 'front_door', confidence: 0.9 },
  { deviceId: 'sensor-3', eventType: 'humanDetected', location: 'living_room', confidence: 0.85 }
];

const decisions = await ai.processBatch(events);

decisions.forEach((decision, index) => {
  console.log(`Event ${index + 1}: ${decision.alertLevel} - ${decision.message}`);
});
```

### Real-time Analytics

```javascript
// Get performance analytics
const analytics = await ai.getAnalytics('24h');

console.log(`False Alarm Reduction: ${analytics.summary.falseAlarmReduction}%`);
console.log(`Average Processing Time: ${analytics.summary.averageProcessingTime}ms`);
console.log(`Alert Distribution:`, analytics.alertDistribution);
```

## Best Practices

### 1. Provide Rich Context

```javascript
// ✅ Good - Rich metadata for better decisions
const event = {
  deviceId: 'camera-001',
  eventType: 'humanDetected',
  location: 'front_door',
  confidence: 0.85,
  metadata: {
    userHome: false,           // Critical for threat assessment
    knownHuman: false,         // Unknown person increases threat
    timeOfDay: 'night',        // Night events are higher risk
    weather: 'clear',          // No interference
    batteryLevel: 0.8,         // Device reliability
    signalStrength: 0.9,       // Connection quality
    hasSnapshot: true,         // Additional evidence
    faceRecognition: false     // Recognition attempt failed
  }
};

// ❌ Poor - Minimal context limits AI effectiveness
const event = {
  deviceId: 'camera-001',
  eventType: 'humanDetected',
  location: 'front_door',
  confidence: 0.85
};
```

### 2. Handle User Presence Intelligently

```javascript
class UserPresenceDetector {
  constructor() {
    this.userHome = null;
    this.lastUpdate = null;
  }

  async detectPresence() {
    // Method 1: Security system arm/disarm status
    if (this.securitySystem.isDisarmed()) {
      this.userHome = true;
    }
    
    // Method 2: Mobile app location services
    const location = await this.getUserLocation();
    if (location && this.isNearHome(location)) {
      this.userHome = true;
    }
    
    // Method 3: Device activity patterns
    const recentActivity = await this.getRecentDeviceActivity();
    if (this.indicatesPresence(recentActivity)) {
      this.userHome = true;
    }
    
    this.lastUpdate = Date.now();
    return this.userHome;
  }
}
```

### 3. Implement Fallback Logic

```javascript
async function processEventWithFallback(event) {
  try {
    // Try MobileNovin AI first
    return await ai.processEvent(event);
  } catch (error) {
    console.warn('AI processing failed, using fallback:', error.message);
    
    // Fallback to simple rule-based logic
    return {
      alertLevel: getBasicAlertLevel(event),
      message: `${event.eventType} detected`,
      threatScore: 50,
      confidence: event.confidence,
      reasoning: 'Fallback logic - AI unavailable',
      processingTime: 0
    };
  }
}

function getBasicAlertLevel(event) {
  // Simple rule-based fallback
  if (event.eventType === 'glassBreak') return 'CRITICAL';
  if (event.eventType === 'humanDetected' && event.confidence > 0.8) return 'ELEVATED';
  if (event.confidence < 0.3) return 'IGNORE';
  return 'STANDARD';
}
```

### 4. Optimize for Performance

```javascript
// Use connection pooling for high-volume applications
const ai = new MobileNovinAI({
  apiKey: 'your-api-key',
  brandId: 'your-brand-id',
  
  // Performance optimizations
  timeout: 3000,           // 3 second timeout
  retries: 2,              // Retry failed requests
  maxConcurrency: 100,     // Limit concurrent requests
  
  // Caching for repeated events
  enableCaching: true,
  cacheTimeout: 300000     // 5 minute cache
});

// Batch similar events
const eventBuffer = [];
const BATCH_SIZE = 10;
const BATCH_TIMEOUT = 1000; // 1 second

function bufferEvent(event) {
  eventBuffer.push(event);
  
  if (eventBuffer.length >= BATCH_SIZE) {
    processBatch();
  } else {
    setTimeout(processBatch, BATCH_TIMEOUT);
  }
}

async function processBatch() {
  if (eventBuffer.length === 0) return;
  
  const events = eventBuffer.splice(0, BATCH_SIZE);
  const decisions = await ai.processBatch(events);
  
  decisions.forEach((decision, index) => {
    handleDecision(events[index], decision);
  });
}
```

## Testing & Validation

### Unit Testing

```javascript
const MobileNovinAI = require('@mobilenovin/ai-sdk');

describe('MobileNovin AI Integration', () => {
  let ai;
  
  beforeEach(() => {
    ai = new MobileNovinAI({
      apiKey: 'test-api-key',
      brandId: 'test-brand'
    });
  });
  
  test('should process motion event correctly', async () => {
    const event = {
      deviceId: 'test-sensor',
      eventType: 'motion',
      location: 'front_door',
      confidence: 0.8,
      metadata: { userHome: false, timeOfDay: 'night' }
    };
    
    const decision = await ai.processEvent(event);
    
    expect(decision.alertLevel).toBe('ELEVATED');
    expect(decision.threatScore).toBeGreaterThan(50);
    expect(decision.processingTime).toBeLessThan(5);
  });
});
```

### Integration Testing

```javascript
// Test with your actual devices
async function testIntegration() {
  console.log('Testing MobileNovin AI integration...');
  
  // Test 1: Basic event processing
  const testEvent = {
    deviceId: 'integration-test',
    eventType: 'motion',
    location: 'test_location',
    confidence: 0.8
  };
  
  const decision = await ai.processEvent(testEvent);
  console.log('✅ Basic processing:', decision.alertLevel);
  
  // Test 2: Batch processing
  const batchEvents = Array(5).fill(testEvent);
  const batchDecisions = await ai.processBatch(batchEvents);
  console.log('✅ Batch processing:', batchDecisions.length, 'events');
  
  // Test 3: Analytics
  const analytics = await ai.getAnalytics('1h');
  console.log('✅ Analytics:', analytics.summary);
  
  console.log('Integration test complete!');
}
```

## Troubleshooting

### Common Issues

**1. Authentication Errors**
```javascript
// Check API key and brand ID
const ai = new MobileNovinAI({
  apiKey: 'your-actual-api-key',  // Not 'your-api-key'
  brandId: 'your-actual-brand-id' // Contact support for correct ID
});
```

**2. Rate Limiting**
```javascript
// Implement exponential backoff
async function processWithRetry(event, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await ai.processEvent(event);
    } catch (error) {
      if (error.message.includes('rate limit') && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

**3. Timeout Issues**
```javascript
// Increase timeout for slow networks
const ai = new MobileNovinAI({
  apiKey: 'your-api-key',
  brandId: 'your-brand-id',
  timeout: 10000 // 10 seconds
});
```

### Support Resources

- **Documentation**: https://docs.mobilenovin.ai
- **API Status**: https://status.mobilenovin.ai
- **Support Email**: support@mobilenovin.ai
- **Partner Slack**: Join our integration channel
- **Response Time**: <4 hours for partners

---

**Ready to transform your security system with advanced AI? Follow this guide to get started in minutes, not months.**
