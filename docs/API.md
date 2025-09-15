# MobileNovin AI SDK - API Reference

## Overview

The MobileNovin AI SDK provides a simple, powerful API to integrate advanced behavioral intelligence into any security system. Transform traditional rule-based systems into AI-powered platforms with contextual intelligence and industry-leading false alarm reduction.

## Authentication

All API requests require authentication using your API key and Brand ID.

```javascript
const mobilenovin = new MobileNovinAI({
  apiKey: 'your-api-key',
  brandId: 'your-brand-id'
});
```

## Core Methods

### `processEvent(event)`

Process a single security event and return AI decision.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event` | Object | Yes | Security event data |
| `event.deviceId` | string | Yes | Unique device identifier |
| `event.eventType` | string | Yes | Type of event (see Event Types) |
| `event.location` | string | Yes | Physical location of device |
| `event.confidence` | number | Yes | Event confidence (0.0-1.0) |
| `event.timestamp` | number | No | Unix timestamp (defaults to now) |
| `event.metadata` | Object | No | Additional context data |

**Event Types:**
- `motion` - Motion detected
- `humanDetected` - Person detected
- `doorOpened` - Door opened
- `doorClosed` - Door closed
- `glassBreak` - Glass break detected
- `sound` - Sound detected
- `networkAnomaly` - Network anomaly
- `deviceOffline` - Device went offline
- `batteryLow` - Low battery alert

**Metadata Fields:**

| Field | Type | Description | Impact on AI |
|-------|------|-------------|--------------|
| `userHome` | boolean | User presence (home/away) | High - 1.8x threat multiplier when away |
| `knownHuman` | boolean | Known vs unknown person | High - 1.5x threat for unknown |
| `timeOfDay` | string | 'day', 'evening', 'night' | Medium - 1.4x multiplier for night |
| `weather` | string | Weather conditions | Medium - 0.5x for interference |
| `interference` | boolean | Environmental interference | Medium - 0.5x multiplier |
| `batteryLevel` | number | Device battery (0.0-1.0) | Low - affects confidence |
| `signalStrength` | number | Signal strength (0.0-1.0) | Low - affects confidence |

**Returns:**

```javascript
{
  alertLevel: 'IGNORE' | 'STANDARD' | 'ELEVATED' | 'CRITICAL',
  message: 'Human-readable description',
  threatScore: 0-100,
  confidence: 0.0-1.0,
  reasoning: 'AI decision explanation',
  eventId: 'unique-event-id',
  processingTime: 0.5 // milliseconds
}
```

**Example:**

```javascript
const decision = await mobilenovin.processEvent({
  deviceId: 'camera-001',
  eventType: 'humanDetected',
  location: 'front_door',
  confidence: 0.85,
  metadata: {
    userHome: false,
    knownHuman: false,
    timeOfDay: 'night',
    weather: 'clear'
  }
});

console.log(decision);
// {
//   alertLevel: 'CRITICAL',
//   message: 'Person detected with high confidence',
//   threatScore: 87,
//   confidence: 0.85,
//   reasoning: 'AI analysis based on 4 factors',
//   eventId: 'ai-1703123456789-abc123',
//   processingTime: 0.8
// }
```

### `processBatch(events)`

Process multiple events in batch for improved performance.

**Parameters:**
- `events` (Array<Object>): Array of security events (max 100)

**Returns:**
- `Promise<Array<AIDecision>>`: Array of AI decisions

**Example:**

```javascript
const events = [
  { deviceId: 'sensor-1', eventType: 'motion', location: 'hallway', confidence: 0.7 },
  { deviceId: 'sensor-2', eventType: 'doorOpened', location: 'front_door', confidence: 0.9 }
];

const decisions = await mobilenovin.processBatch(events);
console.log(`Processed ${decisions.length} events`);
```

### `setBrandConfiguration(config)`

Configure AI behavior for your brand.

**Parameters:**

```javascript
{
  brandName: 'YourBrand',
  alertThresholds: {
    ignore: 20,      // Events below this score are ignored
    standard: 45,    // Standard alerts
    elevated: 70,    // Elevated alerts
    critical: 85     // Critical alerts
  },
  contextWeights: {
    userPresence: 1.8,  // Multiplier for user away
    timeOfDay: 1.4,     // Multiplier for night events
    location: 1.3,      // Multiplier for entry points
    weather: 0.5        // Multiplier for interference
  },
  customMessages: {
    'CRITICAL': 'YourBrand Alert: {original}',
    'ELEVATED': 'YourBrand Notice: {original}',
    'STANDARD': 'YourBrand Update: {original}',
    'IGNORE': null
  },
  whiteLabel: true
}
```

**Example:**

```javascript
await mobilenovin.setBrandConfiguration({
  brandName: 'SecureTech',
  alertThresholds: {
    ignore: 15,      // More sensitive - fewer ignored events
    standard: 40,
    elevated: 65,
    critical: 80
  },
  contextWeights: {
    userPresence: 2.0,  // Higher weight for home/away
    timeOfDay: 1.2,     // Lower weight for time
    location: 1.5,      // Higher weight for location
    weather: 0.4        // Lower weight for weather
  },
  whiteLabel: true
});
```

### `getAnalytics(timeRange)`

Retrieve AI performance analytics.

**Parameters:**
- `timeRange` (string): '1h', '24h', '7d', '30d'

**Returns:**

```javascript
{
  summary: {
    totalEvents: 1250,
    falseAlarmReduction: 83.2,
    averageThreatScore: 42.1,
    averageProcessingTime: 0.7
  },
  alertDistribution: {
    ignore: 35.2,
    standard: 28.4,
    elevated: 24.1,
    critical: 12.3
  },
  topEventTypes: [
    { type: 'motion', count: 450, avgScore: 38.2 },
    { type: 'humanDetected', count: 320, avgScore: 52.1 }
  ],
  performance: {
    uptime: 99.98,
    averageLatency: 0.7,
    errorRate: 0.02
  }
}
```

### `getStatus()`

Get real-time system status.

**Returns:**

```javascript
{
  status: 'operational',
  version: '1.0.0',
  region: 'us-east-1',
  uptime: 99.98,
  latency: 0.6,
  rateLimit: {
    remaining: 950,
    resetTime: 1703123456
  }
}
```

### `registerWebhook(url, events)`

Register webhook for real-time notifications.

**Parameters:**
- `url` (string): Your webhook URL
- `events` (Array<string>): Event types to subscribe to

**Example:**

```javascript
await mobilenovin.registerWebhook(
  'https://your-api.com/webhooks/mobilenovin',
  ['critical', 'elevated', 'analytics']
);
```

## Error Handling

All methods throw `MobileNovinError` on failure:

```javascript
try {
  const decision = await mobilenovin.processEvent(event);
} catch (error) {
  if (error instanceof MobileNovinError) {
    console.error('MobileNovin Error:', error.message);
    if (error.originalError) {
      console.error('Original Error:', error.originalError);
    }
  }
}
```

## Rate Limits

- **Standard Plan**: 1,000 requests per second
- **Professional Plan**: 5,000 requests per second  
- **Enterprise Plan**: 25,000 requests per second

Rate limit headers are included in responses:
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Reset timestamp

## Response Times

- **Target**: <1ms average processing time
- **SLA**: <5ms 99th percentile
- **Timeout**: 5 seconds (configurable)

## Best Practices

### 1. Provide Rich Metadata

```javascript
// Good - Rich context for better AI decisions
const event = {
  deviceId: 'camera-001',
  eventType: 'humanDetected',
  location: 'front_door',
  confidence: 0.85,
  metadata: {
    userHome: false,
    knownHuman: false,
    timeOfDay: 'night',
    weather: 'clear',
    batteryLevel: 0.8,
    signalStrength: 0.9
  }
};

// Bad - Minimal context limits AI effectiveness
const event = {
  deviceId: 'camera-001',
  eventType: 'humanDetected',
  location: 'front_door',
  confidence: 0.85
};
```

### 2. Use Batch Processing

```javascript
// Good - Process multiple events efficiently
const decisions = await mobilenovin.processBatch(events);

// Less efficient - Individual processing
const decisions = await Promise.all(
  events.map(event => mobilenovin.processEvent(event))
);
```

### 3. Handle Errors Gracefully

```javascript
async function processWithFallback(event) {
  try {
    return await mobilenovin.processEvent(event);
  } catch (error) {
    console.error('AI processing failed, using fallback:', error.message);
    
    // Fallback to simple rule-based logic
    return {
      alertLevel: event.eventType === 'glassBreak' ? 'CRITICAL' : 'STANDARD',
      message: `${event.eventType} detected`,
      threatScore: 50,
      confidence: event.confidence,
      reasoning: 'Fallback logic - AI unavailable'
    };
  }
}
```

### 4. Configure for Your Brand

```javascript
// Customize thresholds for your user base
await mobilenovin.setBrandConfiguration({
  brandName: 'YourBrand',
  alertThresholds: {
    ignore: 25,      // Fewer false alarms for consumer brand
    standard: 50,
    elevated: 75,
    critical: 90
  }
});
```

## Support

- **Technical Support**: support@mobilenovin.ai
- **Documentation**: https://docs.mobilenovin.ai
- **Status Page**: https://status.mobilenovin.ai
- **Response Time**: <4 hours for partners
