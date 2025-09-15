/**
 * Goliath Cognitive Interpreter - Domain Sentience™ Engine
 * 
 * A lightweight, embeddable, real-time inference engine that transforms
 * pre-detected security events into semantic threat assessments with
 * intent inference, graduated suspicion scoring, and explainable reasoning.
 * 
 * This is NOT a detection system - it's the mind behind the eyes.
 * 
 * @version 2.0.0 - Cognitive Architecture
 * @author Goliath Security Systems
 * @license Enterprise B2B
 */

// Import required cognitive systems - using dynamic imports for ES6 modules
let SymbolicReasoningEngine, IntentModelingEngine, SpatialTemporalAwareness, AdaptiveLearningSystem;

// Deterministic PRNG for mobile performance repeatability
class DeterministicPRNG {
  constructor(seed = 12345) {
    this.seed = seed;
  }
  
  next() {
    // Linear congruential generator (LCG)
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
  
  range(min, max) {
    return min + this.next() * (max - min);
  }
}

// Simple mock classes for testing when modules aren't available
class MockSymbolicReasoningEngine {
  constructor(config) { 
    this.config = config;
    this.prng = new DeterministicPRNG(config?.seed || 42);
  }
  async reason(event, intent, context) {
    return {
      suspicionLevel: this.prng.range(0.1, 0.9),
      confidence: 0.85,
      reasoning: 'Mock symbolic analysis',
      factors: ['temporal_anomaly', 'behavioral_pattern'],
      // Include required fields for _calculateCognitiveConfidence
      intentConfidence: intent?.confidence || 0.75,
      contextualRelevance: context?.contextualRelevance || 0.6,
      reasoningCertainty: 0.8
    };
  }
  explainDecision(eventId) {
    return {
      eventId,
      reasoning: 'Mock explanation: Decision based on temporal and behavioral analysis',
      factors: [
        { factor: 'temporal_context', weight: 0.4, description: 'Time of day analysis' },
        { factor: 'behavioral_pattern', weight: 0.6, description: 'Movement and action patterns' }
      ],
      confidence: 0.85,
      decisionPath: ['perception', 'intent_analysis', 'symbolic_reasoning', 'suspicion_calculation']
    };
  }
}

class MockIntentModelingEngine {
  constructor(config) { this.config = config; }
  async analyzeIntent(event) {
    return {
      primaryIntent: 'access_attempt',
      confidence: 0.75,
      intentStrength: 0.6,
      behavioralPatterns: ['approach', 'hesitation']
    };
  }
  async assessIntent(event, spatialContext) {
    const timeOfDay = event.metadata?.timeOfDay || '12:00';
    const isUnusualTime = timeOfDay < '06:00' || timeOfDay > '22:00';
    const hasAuthorization = event.metadata?.hasKey || event.metadata?.keycard || false;
    
    return {
      primaryIntent: hasAuthorization ? 'authorized_access' : 'unauthorized_access',
      confidence: event.detectionConfidence * 0.9,
      intentStrength: isUnusualTime ? 0.8 : 0.4,
      behavioralPatterns: event.behaviors || [],
      riskFactors: isUnusualTime ? ['unusual_time'] : [],
      contextualFactors: {
        temporal: isUnusualTime ? 'high_risk' : 'normal',
        authorization: hasAuthorization ? 'authorized' : 'unauthorized'
      }
    };
  }
  assessSequenceIntent(assessments) {
    const avgSuspicion = assessments.reduce((sum, a) => sum + a.suspicionLevel, 0) / assessments.length;
    return {
      sequenceIntent: avgSuspicion > 0.7 ? 'coordinated_threat' : 'normal_activity',
      confidence: 0.8,
      patternStrength: avgSuspicion,
      sequenceFactors: ['temporal_clustering', 'behavioral_consistency']
    };
  }
}

class MockSpatialTemporalAwareness {
  constructor(config) { this.config = config; }
  processEvent(event) {
    return {
      spatialContext: { zone: event.location?.zone || 'unknown', proximity: 'close' },
      temporalContext: { timeCategory: 'unusual', normalcy: 0.3 }
    };
  }
  updatePresence(entityId, location) {
    return { updated: true, spatialContext: { zone: location?.zone || 'unknown' } };
  }
  getAwarenessState() {
    return { activeEntities: [], spatialMap: {}, attentionFocus: 'front_door' };
  }
}

class MockAdaptiveLearningSystem {
  constructor(config) { this.config = config; }
  processFeedback(eventId, feedback) { return { updated: true }; }
  updateNorms(event, assessment) { return { normsUpdated: true }; }
  processAsyncFeedback(eventId, feedback) { 
    return Promise.resolve({ updated: true, adaptations: ['pattern_updated'] }); 
  }
  incorporateFeedback(eventId, correctAssessment) {
    // Align with provideFeedback API
    return {
      updated: true,
      confidence: 0.85,
      adaptationLevel: 'moderate'
    };
  }
  learn(event, assessment) {
    return {
      learned: true,
      patternUpdates: ['behavioral_pattern_refined'],
      confidenceAdjustment: 0.02,
      memoryUpdated: true
    };
  }
}

// Use mocks for now to enable testing
SymbolicReasoningEngine = MockSymbolicReasoningEngine;
IntentModelingEngine = MockIntentModelingEngine;
SpatialTemporalAwareness = MockSpatialTemporalAwareness;
AdaptiveLearningSystem = MockAdaptiveLearningSystem;

// Cross-platform defer function
const defer = typeof queueMicrotask === 'function' 
    ? queueMicrotask 
    : (fn) => setTimeout(fn, 0);

// Memory usage provider interface
const getMemoryUsage = () => {
    if (typeof process !== 'undefined' && process.memoryUsage) {
        return process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
    // Fallback for mobile/browser environments
    if (typeof performance !== 'undefined' && performance.memory) {
        return performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0; // No-op fallback
};

/**
 * Object pool for reusing objects to reduce GC pressure
 */
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 50) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;
    this.pool = [];
    this.inUse = new Set();
  }
  
  acquire() {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }
    this.inUse.add(obj);
    return obj;
  }
  
  release(obj) {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      if (this.resetFn) {
        this.resetFn(obj);
      }
      if (this.pool.length < this.maxSize) {
        this.pool.push(obj);
      }
    }
  }
  
  clear() {
    this.pool.length = 0;
    this.inUse.clear();
  }
  
  getStats() {
    return {
      poolSize: this.pool.length,
      inUse: this.inUse.size,
      maxSize: this.maxSize
    };
  }
}

/**
 * Array pool for reusing arrays to reduce allocations
 */
class ArrayPool {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.pools = new Map(); // size -> array[]
  }
  
  acquire(size = 10) {
    if (!this.pools.has(size)) {
      this.pools.set(size, []);
    }
    
    const pool = this.pools.get(size);
    if (pool.length > 0) {
      const arr = pool.pop();
      arr.length = 0; // Clear the array
      return arr;
    }
    
    return new Array(size);
  }
  
  release(arr) {
    if (!arr || !Array.isArray(arr)) return;
    
    const size = arr.length;
    if (!this.pools.has(size)) {
      this.pools.set(size, []);
    }
    
    const pool = this.pools.get(size);
    if (pool.length < this.maxSize) {
      arr.length = 0; // Clear the array
      pool.push(arr);
    }
  }
  
  clear() {
    this.pools.clear();
  }
}

/**
 * Async scheduler for non-blocking operations on mobile
 */
class AsyncScheduler {
  constructor(config = {}) {
    this.batchSize = config.batchSize || 5;
    this.maxDelay = config.maxDelay || 16; // ~60fps
    this.taskQueue = [];
    this.isProcessing = false;
    this.useIdleCallback = typeof requestIdleCallback === 'function';
  }
  
  schedule(task, priority = 'normal') {
    this.taskQueue.push({ task, priority, timestamp: Date.now() });
    
    if (!this.isProcessing) {
      this._processQueue();
    }
  }
  
  scheduleBatch(tasks, priority = 'normal') {
    const timestamp = Date.now();
    for (const task of tasks) {
      this.taskQueue.push({ task, priority, timestamp });
    }
    
    if (!this.isProcessing) {
      this._processQueue();
    }
  }
  
  _processQueue() {
    if (this.isProcessing || this.taskQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    const processBatch = (deadline) => {
      let processed = 0;
      
      while (this.taskQueue.length > 0 && processed < this.batchSize) {
        // Check if we have time remaining (for requestIdleCallback)
        if (deadline && deadline.timeRemaining() < 1) {
          break;
        }
        
        const { task } = this.taskQueue.shift();
        try {
          task();
        } catch (error) {
          console.error('Async task error:', error);
        }
        processed++;
      }
      
      if (this.taskQueue.length > 0) {
        // Schedule next batch
        this._scheduleNextBatch();
      } else {
        this.isProcessing = false;
      }
    };
    
    if (this.useIdleCallback) {
      requestIdleCallback(processBatch, { timeout: this.maxDelay });
    } else {
      // Fallback to setTimeout
      setTimeout(() => processBatch(), 0);
    }
  }
  
  _scheduleNextBatch() {
    if (this.useIdleCallback) {
      requestIdleCallback((deadline) => {
        this._processQueue();
      }, { timeout: this.maxDelay });
    } else {
      defer(() => this._processQueue());
    }
  }
  
  clear() {
    this.taskQueue.length = 0;
    this.isProcessing = false;
  }
  
  getStats() {
    return {
      queueLength: this.taskQueue.length,
      isProcessing: this.isProcessing,
      useIdleCallback: this.useIdleCallback
    };
  }
}

// Fast numeric hash function (djb2) for cache keys
const hashKey = (...values) => {
    let hash = 5381;
    for (const value of values) {
        const str = String(value);
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
    }
    return hash >>> 0; // Convert to unsigned 32-bit integer
};

// Fixed-capacity LRU Cache for mobile memory management
class FixedCapacityLRU {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }
    
    get(key) {
        if (this.cache.has(key)) {
            // Move to end (most recently used)
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return undefined;
    }
    
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    
    has(key) {
        return this.cache.has(key);
    }
    
    delete(key) {
        return this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
    }
    
    size() {
        return this.cache.size;
    }
    
    keys() {
        return Array.from(this.cache.keys());
    }
    
    values() {
        return Array.from(this.cache.values());
    }
    
    // Make it iterable
    [Symbol.iterator]() {
        return this.cache[Symbol.iterator]();
    }
    
    entries() {
        return Array.from(this.cache.entries());
    }
}

// Ring buffer for fixed-capacity arrays
class RingBuffer {
    constructor(maxSize = 100) {
        this.maxSize = maxSize;
        this.buffer = [];
        this.head = 0;
        this.size = 0;
    }
    
    push(item) {
        if (this.size < this.maxSize) {
            this.buffer.push(item);
            this.size++;
        } else {
            this.buffer[this.head] = item;
            this.head = (this.head + 1) % this.maxSize;
        }
    }
    
    getAll() {
        if (this.size < this.maxSize) {
            return [...this.buffer];
        }
        // Return items in chronological order
        return [...this.buffer.slice(this.head), ...this.buffer.slice(0, this.head)];
    }
    
    getRecent(count) {
        const all = this.getAll();
        return all.slice(-count);
    }
    
    clear() {
        this.buffer = [];
        this.head = 0;
        this.size = 0;
    }
}

// P2 Quantile Estimator for O(1) percentile calculations
class P2QuantileEstimator {
    constructor(quantile) {
        this.p = quantile; // Target quantile (0-1)
        this.markers = []; // Height markers
        this.positions = []; // Position markers
        this.desiredPositions = []; // Desired positions
        this.initialized = false;
        this.count = 0;
    }
    
    update(value) {
        this.count++;
        
        if (!this.initialized) {
            this.markers.push(value);
            
            if (this.markers.length === 5) {
                // Initialize with first 5 observations
                this.markers.sort((a, b) => a - b);
                this.positions = [1, 2, 3, 4, 5];
                this.desiredPositions = [
                    1,
                    1 + 2 * this.p,
                    1 + 4 * this.p,
                    3 + 2 * this.p,
                    5
                ];
                this.initialized = true;
            }
            return;
        }
        
        // Find cell k
        let k = 0;
        if (value < this.markers[0]) {
            this.markers[0] = value;
            k = 1;
        } else if (value >= this.markers[4]) {
            this.markers[4] = value;
            k = 4;
        } else {
            for (let i = 1; i < 5; i++) {
                if (value < this.markers[i]) {
                    k = i;
                    break;
                }
            }
        }
        
        // Increment positions
        for (let i = k; i < 5; i++) {
            this.positions[i]++;
        }
        
        // Update desired positions
        this.desiredPositions[1] = 1 + 2 * this.p * (this.count - 1);
        this.desiredPositions[2] = 1 + 4 * this.p * (this.count - 1);
        this.desiredPositions[3] = 3 + 2 * this.p * (this.count - 1);
        this.desiredPositions[4] = this.count;
        
        // Adjust heights of markers
        for (let i = 1; i < 4; i++) {
            const d = this.desiredPositions[i] - this.positions[i];
            
            if ((d >= 1 && this.positions[i + 1] - this.positions[i] > 1) ||
                (d <= -1 && this.positions[i - 1] - this.positions[i] < -1)) {
                
                const dSign = Math.sign(d);
                const qPrime = this._parabolic(i, dSign);
                
                if (this.markers[i - 1] < qPrime && qPrime < this.markers[i + 1]) {
                    this.markers[i] = qPrime;
                } else {
                    this.markers[i] = this._linear(i, dSign);
                }
                
                this.positions[i] += dSign;
            }
        }
    }
    
    _parabolic(i, d) {
        const qi = this.markers[i];
        const qiMinus1 = this.markers[i - 1];
        const qiPlus1 = this.markers[i + 1];
        const ni = this.positions[i];
        const niMinus1 = this.positions[i - 1];
        const niPlus1 = this.positions[i + 1];
        
        return qi + (d / (niPlus1 - niMinus1)) * (
            (ni - niMinus1 + d) * (qiPlus1 - qi) / (niPlus1 - ni) +
            (niPlus1 - ni - d) * (qi - qiMinus1) / (ni - niMinus1)
        );
    }
    
    _linear(i, d) {
        const qi = this.markers[i];
        const ni = this.positions[i];
        
        if (d === 1) {
            const qiPlus1 = this.markers[i + 1];
            const niPlus1 = this.positions[i + 1];
            return qi + d * (qiPlus1 - qi) / (niPlus1 - ni);
        } else {
            const qiMinus1 = this.markers[i - 1];
            const niMinus1 = this.positions[i - 1];
            return qi + d * (qi - qiMinus1) / (ni - niMinus1);
        }
    }
    
    getQuantile() {
        if (!this.initialized) {
            if (this.markers.length === 0) return 0;
            const sorted = [...this.markers].sort((a, b) => a - b);
            const index = Math.floor(this.p * (sorted.length - 1));
            return sorted[index];
        }
        
        return this.markers[2]; // Middle marker approximates the quantile
    }
}

class GoliathCognitiveInterpreter {
  constructor(config = {}) {
    this.config = {
      // Edge-native configuration - no cloud dependencies
      edgeMode: true,
      performanceOptimized: false,
      maxMemoryEvents: config.maxMemoryEvents || 10000,
      memoryRetentionHours: config.memoryRetentionHours || 168, // 7 days
      memoryLimit: 128 * 1024 * 1024, // 128MB
      processingTimeout: config.latencyTarget ? config.latencyTarget : 5, // 5ms for edge
      uncertaintyThreshold: config.uncertaintyThreshold || 0.3,
      confidenceThreshold: 0.7,
      explainabilityLevel: config.performanceOptimized ? 'minimal' : 'detailed',
      spatialRadius: config.spatialRadius || 50, // meters
      temporalWindow: config.temporalWindow || 3600000, // 1 hour in ms
      adaptiveLearning: true,
      spatialAwareness: true,
      temporalContinuity: true,
      embodiedCognition: true,
      batchProcessing: config.performanceOptimized || false,
      cacheSize: config.performanceOptimized ? 1000 : 5000,
      knownActivityHandling: config.knownActivityHandling || 'low',
      alertBackoffMs: config.alertBackoffMs || 60000,
      suspicionThresholds: { info: 0.15, standard: 0.3, elevated: 0.55, critical: 0.8, ...(config.suspicionThresholds || {}) },
      highRiskNightEntryBoost: config.highRiskNightEntryBoost ?? 0.25,
      enforceNightEntryMin: config.enforceNightEntryMin || 'standard',
      
      // Mobile feature flags
      enableSequenceAnalysis: config.enableSequenceAnalysis !== undefined ? config.enableSequenceAnalysis : true,
      enableDeepInsights: config.enableDeepInsights !== undefined ? config.enableDeepInsights : true,
      enableNormalPatterns: config.enableNormalPatterns !== undefined ? config.enableNormalPatterns : true,
      enableMetricsCollection: config.enableMetricsCollection !== undefined ? config.enableMetricsCollection : true,
      enableAdaptiveLearning: config.enableAdaptiveLearning !== undefined ? config.enableAdaptiveLearning : true,
      
      // Mobile optimizations
      asyncScheduling: config.asyncScheduling || false,
      objectPooling: config.objectPooling || false,
      metricsMode: config.metricsMode || 'full', // 'full', 'ema_only', 'p2_estimator'
      platform: config.platform || 'node', // 'node', 'react-native', 'browser'
      
      ...config
    };
    
    // Core cognitive systems
    this.contextualMemory = new ContextualMemorySystem(this.config);
    this.intentModeler = new IntentModelingEngine(this.config);
    this.reasoningEngine = new SymbolicReasoningEngine(this.config);
    this.spatialAwareness = new SpatialTemporalAwareness(this.config);
    this.adaptiveLearning = new AdaptiveLearningSystem(this.config);
    
    // Performance tracking with EMA windowing
    this.performanceMetrics = {
      totalInferences: 0,
      emaLatency: 0, // Exponential Moving Average for latency
      emaAlpha: 0.1, // EMA smoothing factor (0.1 = 10% weight to new values)
      memoryUsage: 0,
      cacheHits: 0,
      cacheMisses: 0,
      recentLatencies: [], // Sliding window for detailed analysis
      maxWindowSize: 100
    };
    
    // Alert dedup/backoff tracking
    this._alertTimestamps = new Map();
    
    this._initializeCognition();
    
    // Initialize object pools if enabled
    if (this.config.objectPooling) {
      this._initializeObjectPools();
    }
    
    // Initialize async scheduler if enabled
    if (this.config.asyncScheduling) {
      this.scheduler = new AsyncScheduler({
        batchSize: this.config.schedulerBatchSize || 5,
        maxDelay: this.config.schedulerMaxDelay || 16
      });
    }
    
    // Initialize auto-save system if available
    this._initializeAutoSave().catch(err => console.warn('Auto-save init failed:', err.message));
  }

  /**
   * Primary cognitive processing method
   * Transforms structured perception events into understood intent
   * 
   * @param {Object} perceptionEvent - Pre-detected, structured event
   * @param {string} perceptionEvent.entityType - 'adult_male', 'vehicle', 'animal', etc.
   * @param {string} perceptionEvent.entityId - Unique entity identifier
   * @param {string} perceptionEvent.location - Spatial location identifier
   * @param {number} perceptionEvent.timestamp - Unix timestamp
   * @param {Array} perceptionEvent.behaviors - Observed behaviors ['avoiding_cameras', 'carrying_bag']
   * @param {Object} perceptionEvent.spatialData - Position, movement vector, etc.
   * @param {number} perceptionEvent.detectionConfidence - Perception system confidence
   * @returns {CognitiveAssessment} Semantic threat assessment with reasoning
   */
  async interpretEvent(perceptionEvent) {
    const startTime = performance.now();
    
    try {
      // Performance optimization: check cache first
      if (this.config.performanceOptimized) {
        const cached = this._checkEventCache(perceptionEvent);
        if (cached) {
          cached.processingLatency = performance.now() - startTime;
          cached.fromCache = true;
          return cached;
        } else {
          this.performanceMetrics.cacheMisses++;
        }
      }
      
      // Validate structured input
      this._validatePerceptionEvent(perceptionEvent);
      
      // Update spatial-temporal awareness
      this.spatialAwareness.updatePresence(perceptionEvent.entityId, perceptionEvent.location);
      
      // Retrieve relevant contextual memory with timeout
      const contextPromise = this.contextualMemory.retrieveRelevantContext(
        perceptionEvent.location,
        perceptionEvent.timestamp,
        perceptionEvent.entityType
      );
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Context retrieval timeout')), this.config.processingTimeout)
      );
      
      const contextualHistory = await Promise.race([contextPromise, timeoutPromise]);
      
      // Model intent from behaviors and context
      const intentAssessment = await this.intentModeler.assessIntent(
        perceptionEvent,
        contextualHistory
      );
      
      // Apply symbolic-probabilistic reasoning
      const cognitiveAssessment = await this.reasoningEngine.reason(
        perceptionEvent,
        intentAssessment,
        contextualHistory
      );
      
      // Store in contextual memory for future reference (async for performance)
      if (!this.config.performanceOptimized) {
        await this.contextualMemory.storeEvent(perceptionEvent, cognitiveAssessment);
      } else {
        defer(() => this.contextualMemory.storeEvent(perceptionEvent, cognitiveAssessment));
      }
      
      // Adaptive learning from this inference (async for performance)
      if (!this.config.performanceOptimized) {
        this.adaptiveLearning.learn(perceptionEvent, cognitiveAssessment);
      } else {
        defer(() => this.adaptiveLearning.learn(perceptionEvent, cognitiveAssessment));
      }
      
      // Performance tracking
      const processingTime = performance.now() - startTime;
      this._updatePerformanceMetrics(processingTime);
      
      // Generate unique event ID for sequence context tracking
      const eventId = this.contextualMemory._generateEventId(perceptionEvent);
      
      // Apply alert policy and suspicion shaping
      const rawSuspicion = typeof cognitiveAssessment.suspicionLevel === 'number' ? cognitiveAssessment.suspicionLevel : 0;
      const policy = this._applyAlertPolicy(perceptionEvent, intentAssessment, cognitiveAssessment, contextualHistory);
      
      // Create result using object pooling if enabled
      let result;
      if (this.config.objectPooling && this.assessmentPool) {
        result = this.assessmentPool.acquire();
        Object.assign(result, cognitiveAssessment);
        result.eventId = eventId;
        result.rawSuspicion = rawSuspicion;
        result.suspicionLevel = policy.shapedSuspicion;
        result.alertLevel = policy.alertLevel;
        result.shouldNotify = policy.shouldNotify;
        result.policyReasons = policy.reasons;
        result.processingLatency = Math.round(processingTime * 100) / 100;
        result.cognitiveConfidence = this._calculateCognitiveConfidence(cognitiveAssessment);
        result.timestamp = Date.now();
      } else {
        result = {
          ...cognitiveAssessment,
          eventId,
          rawSuspicion,
          suspicionLevel: policy.shapedSuspicion,
          alertLevel: policy.alertLevel,
          shouldNotify: policy.shouldNotify,
          policyReasons: policy.reasons,
          processingLatency: Math.round(processingTime * 100) / 100,
          cognitiveConfidence: this._calculateCognitiveConfidence(cognitiveAssessment),
          timestamp: Date.now()
        };
      }
      
      // Cache result for performance optimization
      if (this.config.performanceOptimized) {
        this._cacheEventResult(perceptionEvent, result);
      }
      
      // Track AI assessment for auto-save
      this._markChanged({
        type: 'event_interpreted',
        eventId: result.eventId,
        suspicionLevel: result.suspicionLevel,
        entityType: perceptionEvent.entityType,
        processingTime: result.processingLatency,
        isAiGenerated: true,
        source: 'ai',
        timestamp: Date.now()
      });
      
      return result;
      
    } catch (error) {
      throw new CognitiveError(`Interpretation failed: ${error.message}`, error);
    }
  }

  /**
   * Batch processing for multiple simultaneous events
   * Maintains contextual relationships between events
   */
  async interpretEventSequence(perceptionEvents) {
    if (!Array.isArray(perceptionEvents) || perceptionEvents.length === 0) {
      throw new CognitiveError('Event sequence must be a non-empty array');
    }
    
    // Sort by timestamp to maintain temporal order
    const sortedEvents = perceptionEvents.sort((a, b) => a.timestamp - b.timestamp);
    
    const assessments = [];
    
    for (const event of sortedEvents) {
      const assessment = await this.interpretEvent(event);
      assessments.push(assessment);
      
      // Update sequence context for next event
      this.contextualMemory.updateSequenceContext(assessments);
    }
    
    // Analyze sequence-level patterns
    const sequenceAssessment = this.intentModeler.assessSequenceIntent(assessments);
    
    return {
      individualAssessments: assessments,
      sequenceAssessment,
      totalEvents: assessments.length
    };
  }

  /**
   * Query the cognitive state for explanations
   */
  explainReasoning(eventId) {
    return this.reasoningEngine.explainDecision(eventId);
  }

  /**
   * Get current spatial-temporal awareness state
   */
  getSpatialAwareness() {
    return this.spatialAwareness.getAwarenessState();
  }

  /**
   * Get contextual memory insights
   */
  getContextualInsights(location, timeRange) {
    return this.contextualMemory.getInsights(location, timeRange);
  }

  /**
   * Update learned norms from feedback
   */
  provideFeedback(eventId, correctAssessment) {
    try {
      // Skip feedback processing if adaptive learning is disabled
      if (!this.config.enableAdaptiveLearning) {
        return { updated: false, reason: 'adaptive_learning_disabled' };
      }
      
      return this.adaptiveLearning.incorporateFeedback(eventId, correctAssessment);
    } catch (error) {
      // Graceful fallback for mobile/ultra_light mode
      console.warn('Feedback processing disabled or unavailable:', error.message);
      return { updated: false, reason: 'feedback_disabled' };
    }
  }

  // Private methods

  _initializeCognition() {
    // Initialize cognitive systems
    console.log('🧠 Initializing Goliath Cognitive Interpreter...');
    console.log('📊 Memory capacity:', this.config.maxMemoryEvents, 'events');
    console.log('🎯 Spatial awareness radius:', this.config.spatialRadius, 'meters');
    console.log('⚡ Target latency: <5ms');
  }

  _initializeObjectPools() {
    // Assessment object pool
    this.assessmentPool = new ObjectPool(
      () => ({
        eventId: null,
        suspicionLevel: 0,
        confidence: 0,
        factors: [],
        reasoning: '',
        timestamp: 0,
        spatialContext: null,
        temporalContext: null,
        entityContext: null
      }),
      (obj) => {
        obj.eventId = null;
        obj.suspicionLevel = 0;
        obj.confidence = 0;
        obj.factors.length = 0;
        obj.reasoning = '';
        obj.timestamp = 0;
        obj.spatialContext = null;
        obj.temporalContext = null;
        obj.entityContext = null;
      },
      30 // Max 30 assessment objects in pool
    );
    
    // Array pool for factors and other arrays
    this.arrayPool = new ArrayPool(20);
    
    // Factor object pool
    this.factorPool = new ObjectPool(
      () => ({
        type: '',
        value: 0,
        weight: 0,
        description: ''
      }),
      (obj) => {
        obj.type = '';
        obj.value = 0;
        obj.weight = 0;
        obj.description = '';
      },
      50 // Max 50 factor objects in pool
    );
  }

  _validatePerceptionEvent(event) {
    const required = ['entityType', 'entityId', 'location', 'timestamp', 'behaviors'];
    for (const field of required) {
      if (!event[field]) {
        throw new CognitiveError(`Perception event missing required field: ${field}`);
      }
    }
    
    if (!Array.isArray(event.behaviors)) {
      throw new CognitiveError('Behaviors must be an array');
    }
    
    if (event.detectionConfidence < 0 || event.detectionConfidence > 1) {
      throw new CognitiveError('Detection confidence must be between 0.0 and 1.0');
    }
  }

  _calculateCognitiveConfidence(assessment) {
    // Combine multiple confidence factors
    const factors = [
      assessment.intentConfidence || 0.5,
      assessment.contextualRelevance || 0.5,
      assessment.reasoningCertainty || 0.5
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  _updatePerformanceMetrics(processingTime) {
    // Update performance metrics with EMA
    this.performanceMetrics.totalInferences++;
    
    // Update EMA latency
    if (this.performanceMetrics.emaLatency === 0) {
      this.performanceMetrics.emaLatency = processingTime;
    } else {
      this.performanceMetrics.emaLatency = 
        (this.performanceMetrics.emaAlpha * processingTime) + 
        ((1 - this.performanceMetrics.emaAlpha) * this.performanceMetrics.emaLatency);
    }
    
    // Maintain sliding window for detailed analysis
    this.performanceMetrics.recentLatencies.push(processingTime);
    if (this.performanceMetrics.recentLatencies.length > this.performanceMetrics.maxWindowSize) {
      this.performanceMetrics.recentLatencies.shift();
    }
    
    this.performanceMetrics.memoryUsage = getMemoryUsage();
  }

  /**
   * Performance optimization methods for edge deployment
   */
  _checkEventCache(event) {
    if (!this.eventCache) {
      this.eventCache = new Map();
    }
    
    const cacheKey = this._generateCacheKey(event);
    const cached = this.eventCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < 30000) { // 30 second cache
      this.performanceMetrics.cacheHits++;
      return cached.result;
    }
    
    return null;
  }

  _cacheEventResult(event, result) {
    if (!this.eventCache) {
      this.eventCache = new Map();
    }
    
    const cacheKey = this._generateCacheKey(event);
    this.eventCache.set(cacheKey, {
      result: { ...result },
      timestamp: Date.now()
    });
    
    // Cleanup old cache entries
    if (this.eventCache.size > this.config.cacheSize) {
      const oldestKey = this.eventCache.keys().next().value;
      this.eventCache.delete(oldestKey);
    }
  }

  _generateCacheKey(event) {
    return hashKey(event.entityType, event.location, event.behaviors.join(','), Math.floor(event.timestamp / 60000)); // 1-minute granularity
  }

  /**
   * Get current performance metrics with EMA-based calculations
   * @returns {Object} Performance metrics including latency and memory usage
   */
  getPerformanceMetrics() {
    const cacheHitRate = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses > 0 ?
      this.performanceMetrics.cacheHits / (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) : 0;
    
    // Calculate additional statistics from sliding window
    const recentLatencies = this.performanceMetrics.recentLatencies;
    const windowStats = recentLatencies.length > 0 ? {
      min: Math.min(...recentLatencies),
      max: Math.max(...recentLatencies),
      p95: this._calculatePercentile(recentLatencies, 0.95),
      p99: this._calculatePercentile(recentLatencies, 0.99)
    } : { min: 0, max: 0, p95: 0, p99: 0 };
    
    const metrics = {
      ...this.performanceMetrics,
      averageLatency: this.performanceMetrics.emaLatency, // EMA-based average
      cacheHitRate,
      memoryEfficiency: this.config.memoryLimit / (this.performanceMetrics.memoryUsage * 1024 * 1024),
      latencyStats: {
        ema: this.performanceMetrics.emaLatency,
        ...windowStats,
        windowSize: recentLatencies.length
      }
    };
    
    // Add object pool stats if enabled
    if (this.config.objectPooling) {
      metrics.objectPools = {
        assessments: this.assessmentPool?.getStats() || {},
        factors: this.factorPool?.getStats() || {},
        arrays: {
          poolCount: this.arrayPool?.pools.size || 0
        }
      };
    }
    
    // Add async scheduler stats if enabled
    if (this.config.asyncScheduling && this.scheduler) {
      metrics.asyncScheduler = this.scheduler.getStats();
    }
    
    return metrics;
  }

  /**
   * Release pooled objects (call when assessment is no longer needed)
   */
  releaseAssessment(assessment) {
    if (this.config.objectPooling && this.assessmentPool && assessment) {
      this.assessmentPool.release(assessment);
    }
  }

  /**
   * Clear all object pools
   */
  clearObjectPools() {
    if (this.config.objectPooling) {
      this.assessmentPool?.clear();
      this.factorPool?.clear();
      this.arrayPool?.clear();
    }
  }

  /**
   * Clear async scheduler queue and stop processing
   */
  clearAsyncScheduler() {
    if (this.scheduler) {
      this.scheduler.clear();
    }
  }

  /**
   * Initialize auto-save system
   */
  async _initializeAutoSave() {
    if (this.config.autoSaveEnabled === false) {
      return;
    }

    try {
      // Dynamic import of AutoSaveSystem
      const autoSaveModule = await import('./auto-save-system.js');
      const AutoSaveSystem = autoSaveModule.default;

      this.autoSaveSystem = new AutoSaveSystem({
        autoSaveEnabled: this.config.autoSaveEnabled !== false,
        saveInterval: this.config.autoSaveInterval || 30000, // 30 seconds
        saveDirectory: this.config.autoSaveDirectory || './data/auto-saves',
        maxBackups: this.config.maxAutoSaveBackups || 10,
        devinTrackingEnabled: this.config.devinTrackingEnabled !== false,
        ...this.config.autoSaveConfig
      });

      // Register cognitive systems for auto-save
      if (this.contextualMemory && this.contextualMemory.initializeAutoSave) {
        this.contextualMemory.initializeAutoSave(this.autoSaveSystem);
      }

      if (this.adaptiveLearning && this.adaptiveLearning.initializeAutoSave) {
        this.adaptiveLearning.initializeAutoSave(this.autoSaveSystem);
      }

      // Register main AI system for auto-save
      this.autoSaveSystem.registerComponent('main-ai-system', this);

      console.log('💾 Auto-save system initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize auto-save system:', error.message);
    }
  }

  /**
   * Get current state for saving (required by AutoSaveSystem)
   */
  async getSaveState() {
    return {
      config: {
        // Save only serializable config properties
        maxMemoryEvents: this.config.maxMemoryEvents,
        memoryRetentionHours: this.config.memoryRetentionHours,
        uncertaintyThreshold: this.config.uncertaintyThreshold,
        confidenceThreshold: this.config.confidenceThreshold,
        spatialRadius: this.config.spatialRadius,
        temporalWindow: this.config.temporalWindow,
        suspicionThresholds: this.config.suspicionThresholds,
        // Add other relevant config properties
      },
      performanceMetrics: this.performanceMetrics,
      alertTimestamps: Array.from(this._alertTimestamps.entries()),
      timestamp: Date.now(),
      version: '2.0.0'
    };
  }

  /**
   * Restore state from saved data (required by AutoSaveSystem)
   */
  async restoreFromSave(savedState) {
    if (!savedState) return;

    // Restore performance metrics
    if (savedState.performanceMetrics) {
      this.performanceMetrics = { ...this.performanceMetrics, ...savedState.performanceMetrics };
    }

    // Restore alert timestamps
    if (savedState.alertTimestamps) {
      this._alertTimestamps = new Map(savedState.alertTimestamps);
    }

    console.log('📂 Main AI system state restored');
  }

  /**
   * Force immediate auto-save
   */
  async saveState() {
    if (this.autoSaveSystem) {
      await this.autoSaveSystem.forceSave();
      return true;
    }
    return false;
  }

  /**
   * Load latest auto-save
   */
  async loadLatestState() {
    if (this.autoSaveSystem) {
      const saveData = await this.autoSaveSystem.loadLatestSave();
      if (saveData) {
        await this.autoSaveSystem.restoreFromSave(saveData);
        return true;
      }
    }
    return false;
  }

  /**
   * Get auto-save status and devin changes summary
   */
  getAutoSaveStatus() {
    if (!this.autoSaveSystem) {
      return { enabled: false, message: 'Auto-save not available' };
    }

    return {
      enabled: true,
      ...this.autoSaveSystem.getStatus(),
      devinChangesSummary: this.autoSaveSystem.getDevinChangesSummary()
    };
  }

  /**
   * Export devin changes to file
   */
  async exportDevinChanges() {
    if (this.autoSaveSystem) {
      return await this.autoSaveSystem.exportDevinChanges();
    }
    throw new Error('Auto-save system not available');
  }

  /**
   * Mark system as changed (for tracking devin/AI changes)
   */
  _markChanged(changeDetails = {}) {
    if (this.autoSaveSystem) {
      this.autoSaveSystem.markChanged('main-ai-system', changeDetails);
    }
  }

  /**
   * Schedule a task asynchronously if scheduler is enabled
   */
  scheduleAsync(task, priority = 'normal') {
    if (this.config.asyncScheduling && this.scheduler) {
      this.scheduler.schedule(task, priority);
    } else {
      // Execute immediately if async scheduling is disabled
      task();
    }
  }

  /**
   * Calculate percentile from array of values using P2 quantile estimator for O(1) performance
   */
  _calculatePercentile(values, percentile) {
    if (values.length === 0) return 0;
    
    // Skip percentile calculation if metrics are disabled
    if (!this.config.enableMetricsCollection) {
      return 0;
    }
    
    // Handle different metrics modes
     switch (this.config.metricsMode) {
       case 'ema_only':
         // Return simple EMA approximation for mobile
         return values.length > 0 ? values[values.length - 1] : 0;
         
       case 'p2_estimator': {
         // Use P2 quantile estimator for mobile optimization
         if (!this._p2Estimators) {
           this._p2Estimators = new Map();
         }
         
         const p2Key = `p${Math.round(percentile * 100)}`;
         if (!this._p2Estimators.has(p2Key)) {
           this._p2Estimators.set(p2Key, new P2QuantileEstimator(percentile));
         }
         
         const p2Estimator = this._p2Estimators.get(p2Key);
         // Update estimator with recent values
         values.slice(-10).forEach(v => p2Estimator.update(v));
         return p2Estimator.getQuantile();
       }
         
       case 'full':
       default: {
         // For small datasets, use simple sorting
         if (values.length <= 5) {
           const sorted = [...values].sort((a, b) => a - b);
           const index = Math.ceil(sorted.length * percentile) - 1;
           return sorted[Math.max(0, index)];
         }
         
         // P2 quantile estimator for larger datasets
         if (!this._p2Estimators) {
           this._p2Estimators = new Map();
         }
         
         const fullKey = `p${Math.round(percentile * 100)}`;
         if (!this._p2Estimators.has(fullKey)) {
           this._p2Estimators.set(fullKey, new P2QuantileEstimator(percentile));
         }
         
         const fullEstimator = this._p2Estimators.get(fullKey);
         
         // Update estimator with recent values
         const recentValues = values.slice(-10); // Only process recent values for efficiency
         for (const value of recentValues) {
           fullEstimator.update(value);
         }
         
         return fullEstimator.getQuantile();
       }
     }
  }

  // Alert policy and filtering for on-device lightweight usage
  _applyAlertPolicy(event, intent, assessment, context) {
    let shaped = typeof assessment.suspicionLevel === 'number' ? assessment.suspicionLevel : 0;
    const reasons = [];
    const authorized = this._isAuthorizedOrKnown(event, intent);

    // Downweight and cap authorized/known activity
    if (authorized) {
      shaped = Math.max(0, shaped - 0.5);
      reasons.push('authorized_downweight');
      if (shaped > 0.3) {
        shaped = 0.3;
        reasons.push('authorized_cap');
      }
    }

    // Nudge down if matching normal patterns
    if (context && context.normalPatterns && Object.keys(context.normalPatterns).length > 0) {
      shaped = Math.max(0, shaped - 0.1);
      reasons.push('normal_pattern');
    }

    // High-risk boost for unauthorized at night on entry points
    const unauthorized = !authorized && (intent && intent.primaryIntent === 'unauthorized_access');
    const isNightRisk = Array.isArray(intent?.riskFactors) && intent.riskFactors.includes('unusual_time');
    const isEntryPoint = typeof event.location === 'string' && (event.location.includes('door') || event.location.includes('window'));
    const highRiskNightEntry = unauthorized && isNightRisk && isEntryPoint;
    if (highRiskNightEntry) {
      const boost = this.config.highRiskNightEntryBoost ?? 0.25;
      shaped = Math.min(1, shaped + boost);
      reasons.push('night_unauthorized_entry_boost');
    }

    // Determine base alert level
    let alertLevel = this._computeAlertLevel(shaped);
    let shouldNotify = alertLevel !== 'info';

    // Enforce minimum level for high-risk night entry
    if (highRiskNightEntry) {
      const minLevel = this.config.enforceNightEntryMin || 'standard';
      if (this._compareAlertLevels(alertLevel, minLevel) < 0) {
        alertLevel = minLevel;
        shouldNotify = true;
        reasons.push('night_unauthorized_entry_min');
      }
    }

    // Apply user preference for known activity handling
    const handling = this.config.knownActivityHandling || 'low';
    if (authorized) {
      if (handling === 'ignore') {
        if (!intent || !Array.isArray(intent.riskFactors) || intent.riskFactors.length === 0) {
          alertLevel = 'info';
          shouldNotify = false;
          reasons.push('known_ignore');
        }
      } else if (handling === 'silent') {
        alertLevel = 'info';
        shouldNotify = false;
        reasons.push('known_silent');
      } else if (handling === 'low') {
        const downgraded = this._downgradeAlertLevel(alertLevel);
        if (downgraded !== alertLevel) reasons.push('known_downgrade');
        alertLevel = downgraded;
        shouldNotify = alertLevel !== 'info';
      }
    }

    // Confidence gating (lightweight)
    const cognitiveConfidence = this._calculateCognitiveConfidence(assessment);
    if (cognitiveConfidence < (this.config.confidenceThreshold || 0.7) && alertLevel !== 'critical') {
      if (alertLevel === 'elevated') { alertLevel = 'standard'; reasons.push('low_confidence_downgrade'); }
      else if (alertLevel === 'standard') { alertLevel = 'info'; shouldNotify = false; reasons.push('low_confidence_suppress'); }
    }

    // Re-enforce minimum level for high-risk night entry after gating
    if (typeof highRiskNightEntry !== 'undefined' && highRiskNightEntry) {
      const minLevel = this.config.enforceNightEntryMin || 'standard';
      if (this._compareAlertLevels(alertLevel, minLevel) < 0) {
        alertLevel = minLevel;
        shouldNotify = true;
        reasons.push('night_unauthorized_entry_min_enforced');
      }
    }

    // Backoff-based suppression/downgrade to reduce spam
    const key = `${event.entityId}@${event.location}`;
    const now = Date.now();
    if (this._shouldSuppressByBackoff(key, now)) {
      if (alertLevel === 'critical') {
        alertLevel = this._downgradeAlertLevel(alertLevel);
        reasons.push('backoff_downgrade');
      } else {
        alertLevel = 'info';
        shouldNotify = false;
        reasons.push('backoff_suppress');
      }
    }

    // Record last alert time when notifying
    if (shouldNotify && alertLevel !== 'info') {
      this._alertTimestamps.set(key, now);
    }

    return { shapedSuspicion: shaped, alertLevel, shouldNotify, reasons };
  }

  _isAuthorizedOrKnown(event, intent) {
    const m = event.metadata || {};
    return Boolean(
      (intent && intent.primaryIntent === 'authorized_access') ||
      m.knownHuman || m.whitelistedDevice || m.hasKey || m.keycard
    );
  }

  _computeAlertLevel(suspicion) {
    const t = this.config.suspicionThresholds || { info: 0.15, standard: 0.3, elevated: 0.55, critical: 0.8 };
    if (suspicion >= t.critical) return 'critical';
    if (suspicion >= t.elevated) return 'elevated';
    if (suspicion >= t.standard) return 'standard';
    if (suspicion >= t.info) return 'info';
    return 'info';
  }

  _downgradeAlertLevel(level) {
    switch (level) {
      case 'critical': return 'elevated';
      case 'elevated': return 'standard';
      case 'standard': return 'info';
      default: return 'info';
    }
  }

  _levelRank(level) {
    switch (level) {
      case 'info': return 0;
      case 'standard': return 1;
      case 'elevated': return 2;
      case 'critical': return 3;
      default: return 0;
    }
  }

  _compareAlertLevels(a, b) {
    return this._levelRank(a) - this._levelRank(b);
  }

  _shouldSuppressByBackoff(key, now) {
    const last = this._alertTimestamps.get(key);
    if (typeof last !== 'number') return false;
    return (now - last) < (this.config.alertBackoffMs || 60000);
  }

  /**
   * Clear performance cache for memory optimization
   */
  clearCache() {
    if (this.eventCache) {
      this.eventCache.clear();
    }
  }
}

/**
 * Contextual Memory System
 * Maintains persistent awareness of spatial-temporal patterns with mobile-optimized memory caps
 */
class ContextualMemorySystem {
  constructor(config) {
    this.config = config;
    const memoryConfig = config.memoryConfig || {};
    
    // Fixed-capacity memory stores for mobile optimization
    this.eventMemory = new FixedCapacityLRU(memoryConfig.eventCapacity || 500);
    this.spatialMemory = new FixedCapacityLRU(memoryConfig.spatialCapacity || 200);
    this.temporalMemory = new FixedCapacityLRU(memoryConfig.temporalCapacity || 100);
    this.entityMemory = new FixedCapacityLRU(memoryConfig.entityCapacity || 150);
    this.normalPatterns = new FixedCapacityLRU(memoryConfig.patternsCapacity || 300);
    
    // Ring buffers for location-specific event lists
    this.spatialBuffers = new Map();
    this.temporalBuffers = new Map();
    this.entityBuffers = new Map();
  }

  async retrieveRelevantContext(location, timestamp, entityType) {
    const spatialContext = this._getSpatialContext(location);
    const temporalContext = this._getTemporalContext(timestamp);
    const entityContext = this._getEntityContext(entityType);
    const normalPatterns = this._getNormalPatterns(location, timestamp);
    
    return {
      spatialContext,
      temporalContext,
      entityContext,
      normalPatterns,
      contextualRelevance: this._calculateContextualRelevance(spatialContext, temporalContext)
    };
  }

  async storeEvent(perceptionEvent, cognitiveAssessment) {
    const eventId = this._generateEventId(perceptionEvent);
    
    // Store in multiple indices for fast retrieval with LRU eviction
    this.eventMemory.set(eventId, { perceptionEvent, cognitiveAssessment });
    
    // Spatial indexing using ring buffers
    const location = perceptionEvent.location;
    if (!this.spatialBuffers.has(location)) {
      this.spatialBuffers.set(location, new RingBuffer(100)); // 100 events per location
    }
    this.spatialBuffers.get(location).push(eventId);
    this.spatialMemory.set(location, this.spatialBuffers.get(location).getRecent(50));
    
    // Temporal indexing using ring buffers
    const timeWindow = this._getTimeWindow(perceptionEvent.timestamp);
    if (!this.temporalBuffers.has(timeWindow)) {
      this.temporalBuffers.set(timeWindow, new RingBuffer(50)); // 50 events per time window
    }
    this.temporalBuffers.get(timeWindow).push(eventId);
    this.temporalMemory.set(timeWindow, this.temporalBuffers.get(timeWindow).getRecent(25));
    
    // Entity behavioral history using ring buffers
    const entityId = perceptionEvent.entityId;
    if (!this.entityBuffers.has(entityId)) {
      this.entityBuffers.set(entityId, new RingBuffer(20)); // 20 events per entity
    }
    this.entityBuffers.get(entityId).push({
      timestamp: perceptionEvent.timestamp,
      behaviors: perceptionEvent.behaviors,
      assessment: cognitiveAssessment
    });
    this.entityMemory.set(entityId, this.entityBuffers.get(entityId).getRecent(10));
    
    // Update normal patterns if assessment indicates normal behavior and feature is enabled
    if (this.config.enableNormalPatterns && cognitiveAssessment.suspicionLevel < 0.3) {
      this._updateNormalPatterns(perceptionEvent);
    }
    
    // Memory cleanup (reduced frequency on mobile)
    const cleanupChance = this.config.performanceOptimized ? 0.05 : 0.1;
    if (Math.random() < cleanupChance) {
      if (this.config.asyncScheduling && this.scheduler) {
        // Schedule cleanup asynchronously to avoid blocking
        this.scheduler.schedule(() => this._cleanupOldMemories(), 'low');
      } else {
        this._cleanupOldMemories();
      }
    }
  }

  updateSequenceContext(assessments) {
    // Track sequence patterns for improved context if enabled
    if (this.config.enableSequenceAnalysis) {
      const sequenceKey = hashKey(...assessments.map(a => a.eventId));
      // Implementation for sequence pattern learning
    }
  }

  getInsights(location, timeRange) {
    const events = this.spatialMemory.get(location) || [];
    const recentEvents = events.filter(eventId => {
      const event = this.eventMemory.get(eventId);
      return event && (Date.now() - event.perceptionEvent.timestamp) <= timeRange;
    });
    
    return {
      totalEvents: recentEvents.length,
      averageSuspicion: this._calculateAverageSuspicion(recentEvents),
      commonBehaviors: this._getCommonBehaviors(recentEvents),
      normalPatterns: this.normalPatterns.get(location) || {}
    };
  }

  // Private methods for contextual memory
  _getSpatialContext(location) {
    const nearbyEvents = this.spatialMemory.get(location) || [];
    return nearbyEvents.slice(-10).map(eventId => this.eventMemory.get(eventId)).filter(Boolean);
  }

  _getTemporalContext(timestamp) {
    const timeWindow = this._getTimeWindow(timestamp);
    const recentEvents = this.temporalMemory.get(timeWindow) || [];
    return recentEvents.slice(-5).map(eventId => this.eventMemory.get(eventId)).filter(Boolean);
  }

  _getEntityContext(entityType) {
    // Return behavioral patterns for this entity type
    const entityEvents = [];
    for (const [entityId, history] of this.entityMemory.entries()) {
      const recentHistory = history.slice(-3);
      entityEvents.push(...recentHistory);
    }
    return entityEvents;
  }

  _getNormalPatterns(location, timestamp) {
    const hour = new Date(timestamp).getHours();
    const dayOfWeek = new Date(timestamp).getDay();
    const patternKey = hashKey(location, hour, dayOfWeek);
    return this.normalPatterns.get(patternKey) || {};
  }

  _calculateContextualRelevance(spatialContext, temporalContext) {
    const spatialRelevance = spatialContext.length > 0 ? 0.8 : 0.2;
    const temporalRelevance = temporalContext.length > 0 ? 0.7 : 0.3;
    return (spatialRelevance + temporalRelevance) / 2;
  }

  _generateEventId(event) {
    return `evt-${event.timestamp}-${event.entityId}-${Math.random().toString(36).substr(2, 6)}`;
  }

  _getTimeWindow(timestamp) {
    return Math.floor(timestamp / this.config.temporalWindow) * this.config.temporalWindow;
  }

  _updateNormalPatterns(event) {
    const hour = new Date(event.timestamp).getHours();
    const dayOfWeek = new Date(event.timestamp).getDay();
    const patternKey = hashKey(event.location, hour, dayOfWeek);
    
    if (!this.normalPatterns.has(patternKey)) {
      this.normalPatterns.set(patternKey, {
        commonBehaviors: new Map(),
        entityTypes: new Map(),
        frequency: 0
      });
    }
    
    const pattern = this.normalPatterns.get(patternKey);
    pattern.frequency++;
    
    // Update behavior frequencies
    event.behaviors.forEach(behavior => {
      pattern.commonBehaviors.set(behavior, (pattern.commonBehaviors.get(behavior) || 0) + 1);
    });
    
    // Update entity type frequencies
    pattern.entityTypes.set(event.entityType, (pattern.entityTypes.get(event.entityType) || 0) + 1);
  }

  _cleanupOldMemories() {
    const cutoffTime = Date.now() - (this.config.memoryRetentionHours * 60 * 60 * 1000);
    
    // Remove old events
    for (const [eventId, data] of this.eventMemory) {
      if (data.perceptionEvent.timestamp < cutoffTime) {
        this.eventMemory.delete(eventId);
      }
    }
    
    // Cleanup spatial and temporal indices
    // Implementation for index cleanup
  }

  _calculateAverageSuspicion(eventIds) {
    if (eventIds.length === 0) return 0;
    
    const suspicions = eventIds.map(eventId => {
      const event = this.eventMemory.get(eventId);
      return event ? event.cognitiveAssessment.suspicionLevel : 0;
    });
    
    return suspicions.reduce((sum, s) => sum + s, 0) / suspicions.length;
  }

  _getCommonBehaviors(eventIds) {
    const behaviorCounts = new Map();
    
    eventIds.forEach(eventId => {
      const event = this.eventMemory.get(eventId);
      if (event) {
        event.perceptionEvent.behaviors.forEach(behavior => {
          behaviorCounts.set(behavior, (behaviorCounts.get(behavior) || 0) + 1);
        });
      }
    });
    
    return Array.from(behaviorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([behavior, count]) => ({ behavior, frequency: count }));
  }
}

/**
 * Edge deployment optimization utilities
 */
GoliathCognitiveInterpreter.createOptimizedInstance = function(config = {}) {
  return new GoliathCognitiveInterpreter({
    performanceOptimized: true,
    explainabilityLevel: 'minimal',
    batchProcessing: true,
    cacheSize: 1000,
    processingTimeout: 3, // 3ms for edge
    maxMemoryEvents: 5000,
    ...config
  });
};

GoliathCognitiveInterpreter.createHighAccuracyInstance = function(config = {}) {
  return new GoliathCognitiveInterpreter({
    performanceOptimized: false,
    explainabilityLevel: 'detailed',
    batchProcessing: false,
    cacheSize: 5000,
    processingTimeout: 10, // 10ms for accuracy
    maxMemoryEvents: 10000,
    ...config
  });
};

/**
 * Mobile deployment profiles for resource-constrained environments
 */
GoliathCognitiveInterpreter.createUltraLightInstance = function(config = {}) {
  return new GoliathCognitiveInterpreter({
    // Ultra-light mobile profile
    performanceOptimized: true,
    explainabilityLevel: 'minimal',
    cacheSize: 256,
    memoryRetentionHours: 24,
    temporalWindow: 15, // 15 minutes
    spatialRadius: 50, // 50 meters
    maxMemoryEvents: 500,
    
    // Feature flags for mobile
    enableSequenceAnalysis: false,
    enableDeepInsights: false,
    enableNormalPatterns: false,
    enableMetricsCollection: false,
    enableAdaptiveLearning: false,
    
    // Mobile optimizations
      batchProcessing: true,
      asyncScheduling: false, // Keep synchronous for ultra-light
      objectPooling: false,   // Skip pooling overhead
      metricsMode: 'ema_only',
      platform: 'mobile_ultra_light',
      
      // Scheduler config (unused but defined)
      schedulerBatchSize: 3,
      schedulerMaxDelay: 32,
      
      ...config
  });
};

GoliathCognitiveInterpreter.createLightInstance = function(config = {}) {
  return new GoliathCognitiveInterpreter({
    // Light mobile profile
    performanceOptimized: true,
    explainabilityLevel: 'minimal',
    cacheSize: 512,
    memoryRetentionHours: 48,
    temporalWindow: 30, // 30 minutes
    spatialRadius: 100, // 100 meters
    maxMemoryEvents: 1000,
    
    // Feature flags for mobile
    enableSequenceAnalysis: true,
    enableDeepInsights: false,
    enableNormalPatterns: true,
    enableMetricsCollection: true,
    enableAdaptiveLearning: false,
    
    // Mobile-specific optimizations
    batchProcessing: true,
    asyncScheduling: true,
    objectPooling: true,
    metricsMode: 'ema_only', // EMA only, no quantiles
    schedulerBatchSize: 5,
    schedulerMaxDelay: 16,
    ...config
  });
};

GoliathCognitiveInterpreter.createReactNativeInstance = function(config = {}) {
  return new GoliathCognitiveInterpreter({
    // React Native optimized profile
    performanceOptimized: true,
    explainabilityLevel: 'minimal',
    cacheSize: 512,
    memoryRetentionHours: 72,
    temporalWindow: 30,
    spatialRadius: 100,
    maxMemoryEvents: 1000,
    
    // React Native specific
    enableSequenceAnalysis: true,
    enableDeepInsights: false,
    enableNormalPatterns: true,
    enableMetricsCollection: true,
    enableAdaptiveLearning: true,
    
    // Platform optimizations
    batchProcessing: true,
    asyncScheduling: true,
    objectPooling: true,
    metricsMode: 'p2_estimator',
    platform: 'react-native',
    schedulerBatchSize: 8,
    schedulerMaxDelay: 8,
    ...config
  });
};

// Custom error class
class CognitiveError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'CognitiveError';
    this.originalError = originalError;
  }
}

// Export for edge deployment
// ES6 module exports only for better bundling
export { GoliathCognitiveInterpreter, ContextualMemorySystem, CognitiveError };
export default GoliathCognitiveInterpreter;

// Browser global fallback
if (typeof window !== 'undefined') {
  window.GoliathCognitiveInterpreter = GoliathCognitiveInterpreter;
}
