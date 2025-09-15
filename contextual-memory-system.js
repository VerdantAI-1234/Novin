/**
 * Contextual Memory System
 * 
 * A persistent, adaptive memory system that maintains spatial-temporal awareness,
 * behavioral patterns, and contextual norms. This is the "memory" that allows
 * the cognitive interpreter to learn and adapt over time.
 * 
 * @version 2.0.0
 * @author Goliath Security Systems
 */

class ContextualMemorySystem {
  constructor(config) {
    this.config = config;
    
    // Memory stores
    this.spatialMemory = new SpatialMemoryStore();
    this.temporalMemory = new TemporalMemoryStore();
    this.behavioralMemory = new BehavioralMemoryStore();
    this.entityMemory = new EntityMemoryStore();
    this.contextualNorms = new ContextualNormsStore();
    
    // Memory management
    this.memoryCompressor = new MemoryCompressor();
    this.memoryRetrieval = new MemoryRetrieval();
    
    // Adaptive learning
    this.adaptiveLearning = new AdaptiveLearningEngine();
    
    // Memory statistics
    this.memoryStats = {
      totalEvents: 0,
      spatialLocations: 0,
      behavioralPatterns: 0,
      entityProfiles: 0,
      contextualNorms: 0
    };
    
    console.log('🧠 Contextual Memory System initialized');
  }

  // Fast numeric hash function (djb2) for cache keys
  _hashKey(...values) {
    let hash = 5381;
    for (const value of values) {
      const str = String(value);
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
      }
    }
    return hash >>> 0; // Convert to unsigned 32-bit integer
  }

  /**
   * Store a new event in contextual memory
   */
  async storeEvent(perceptionEvent, cognitiveAssessment, feedback = null) {
    const memoryId = this._generateMemoryId();
    const timestamp = Date.now();
    
    try {
      // Create memory entry
      const memoryEntry = {
        memoryId,
        timestamp,
        perceptionEvent,
        cognitiveAssessment,
        feedback,
        spatialContext: this._extractSpatialContext(perceptionEvent),
        temporalContext: this._extractTemporalContext(perceptionEvent),
        behavioralContext: this._extractBehavioralContext(perceptionEvent),
        entityContext: this._extractEntityContext(perceptionEvent)
      };
      
      // Store in appropriate memory stores
      await this._storeInSpatialMemory(memoryEntry);
      await this._storeInTemporalMemory(memoryEntry);
      await this._storeInBehavioralMemory(memoryEntry);
      await this._storeInEntityMemory(memoryEntry);
      
      // Update contextual norms
      await this._updateContextualNorms(memoryEntry);
      
      // Adaptive learning from feedback
      if (feedback) {
        await this.adaptiveLearning.learnFromFeedback(memoryEntry, feedback);
      }
      
      // Update statistics
      this._updateMemoryStats();
      
      // Compress old memories if needed
      await this._compressMemoriesIfNeeded();
      
      return memoryId;
      
    } catch (error) {
      throw new Error(`Failed to store event in memory: ${error.message}`);
    }
  }

  /**
   * Retrieve contextual history for a new event
   */
  async getContextualHistory(perceptionEvent, lookbackHours = 24) {
    const spatialContext = this._extractSpatialContext(perceptionEvent);
    const temporalContext = this._extractTemporalContext(perceptionEvent);
    
    try {
      // Retrieve relevant memories
      const spatialHistory = await this.spatialMemory.getRelevantMemories(
        spatialContext, 
        lookbackHours
      );
      
      const temporalHistory = await this.temporalMemory.getRelevantMemories(
        temporalContext, 
        lookbackHours
      );
      
      const behavioralHistory = await this.behavioralMemory.getRelevantPatterns(
        perceptionEvent.behaviors,
        lookbackHours
      );
      
      const entityHistory = await this.entityMemory.getRelevantEntities(
        perceptionEvent.entityType,
        spatialContext,
        lookbackHours
      );
      
      // Get contextual norms
      const contextualNorms = await this.contextualNorms.getNorms(
        spatialContext,
        temporalContext
      );
      
      // Calculate contextual relevance
      const contextualRelevance = this._calculateContextualRelevance(
        spatialHistory,
        temporalHistory,
        behavioralHistory,
        entityHistory
      );
      
      return {
        spatialHistory,
        temporalHistory,
        behavioralHistory,
        entityHistory,
        contextualNorms,
        contextualRelevance,
        normalPatterns: this._extractNormalPatterns(spatialHistory, temporalHistory, behavioralHistory),
        anomalyPatterns: this._extractAnomalyPatterns(spatialHistory, temporalHistory, behavioralHistory),
        memoryStats: this.memoryStats
      };
      
    } catch (error) {
      throw new Error(`Failed to retrieve contextual history: ${error.message}`);
    }
  }

  /**
   * Learn from feedback to improve future assessments
   */
  async learnFromFeedback(eventId, feedback) {
    try {
      // Find the original memory entry
      const memoryEntry = await this._findMemoryEntry(eventId);
      if (!memoryEntry) {
        throw new Error('Memory entry not found');
      }
      
      // Update memory entry with feedback
      memoryEntry.feedback = feedback;
      
      // Adaptive learning
      await this.adaptiveLearning.learnFromFeedback(memoryEntry, feedback);
      
      // Update contextual norms based on feedback
      await this._updateNormsFromFeedback(memoryEntry, feedback);
      
      return true;
      
    } catch (error) {
      throw new Error(`Failed to learn from feedback: ${error.message}`);
    }
  }

  /**
   * Get memory statistics and insights
   */
  getMemoryInsights() {
    return {
      memoryStats: this.memoryStats,
      spatialInsights: this.spatialMemory.getInsights(),
      temporalInsights: this.temporalMemory.getInsights(),
      behavioralInsights: this.behavioralMemory.getInsights(),
      entityInsights: this.entityMemory.getInsights(),
      learningInsights: this.adaptiveLearning.getInsights()
    };
  }

  // Private memory storage methods

  async _storeInSpatialMemory(memoryEntry) {
    await this.spatialMemory.store({
      memoryId: memoryEntry.memoryId,
      timestamp: memoryEntry.timestamp,
      location: memoryEntry.spatialContext.location,
      coordinates: memoryEntry.spatialContext.coordinates,
      zone: memoryEntry.spatialContext.zone,
      entityType: memoryEntry.perceptionEvent.entityType,
      behaviors: memoryEntry.perceptionEvent.behaviors,
      suspicionLevel: memoryEntry.cognitiveAssessment.suspicionLevel,
      feedback: memoryEntry.feedback
    });
  }

  async _storeInTemporalMemory(memoryEntry) {
    await this.temporalMemory.store({
      memoryId: memoryEntry.memoryId,
      timestamp: memoryEntry.timestamp,
      hour: memoryEntry.temporalContext.hour,
      dayOfWeek: memoryEntry.temporalContext.dayOfWeek,
      timeCategory: memoryEntry.temporalContext.timeCategory,
      entityType: memoryEntry.perceptionEvent.entityType,
      behaviors: memoryEntry.perceptionEvent.behaviors,
      location: memoryEntry.spatialContext.location,
      suspicionLevel: memoryEntry.cognitiveAssessment.suspicionLevel,
      feedback: memoryEntry.feedback
    });
  }

  async _storeInBehavioralMemory(memoryEntry) {
    await this.behavioralMemory.store({
      memoryId: memoryEntry.memoryId,
      timestamp: memoryEntry.timestamp,
      behaviors: memoryEntry.perceptionEvent.behaviors,
      behaviorSequence: memoryEntry.behavioralContext.behaviorSequence,
      entityType: memoryEntry.perceptionEvent.entityType,
      location: memoryEntry.spatialContext.location,
      timeCategory: memoryEntry.temporalContext.timeCategory,
      suspicionLevel: memoryEntry.cognitiveAssessment.suspicionLevel,
      feedback: memoryEntry.feedback
    });
  }

  async _storeInEntityMemory(memoryEntry) {
    await this.entityMemory.store({
      memoryId: memoryEntry.memoryId,
      timestamp: memoryEntry.timestamp,
      entityType: memoryEntry.perceptionEvent.entityType,
      entityId: memoryEntry.entityContext.entityId,
      behaviors: memoryEntry.perceptionEvent.behaviors,
      location: memoryEntry.spatialContext.location,
      timeCategory: memoryEntry.temporalContext.timeCategory,
      suspicionLevel: memoryEntry.cognitiveAssessment.suspicionLevel,
      feedback: memoryEntry.feedback
    });
  }

  async _updateContextualNorms(memoryEntry) {
    await this.contextualNorms.updateNorms({
      location: memoryEntry.spatialContext.location,
      timeCategory: memoryEntry.temporalContext.timeCategory,
      entityType: memoryEntry.perceptionEvent.entityType,
      behaviors: memoryEntry.perceptionEvent.behaviors,
      suspicionLevel: memoryEntry.cognitiveAssessment.suspicionLevel,
      feedback: memoryEntry.feedback
    });
  }

  // Context extraction methods

  _extractSpatialContext(perceptionEvent) {
    return {
      location: perceptionEvent.location,
      coordinates: perceptionEvent.spatialData?.coordinates || null,
      zone: this._determineZone(perceptionEvent.location),
      proximityToEntry: this._calculateProximityToEntry(perceptionEvent.location),
      visibility: this._calculateVisibility(perceptionEvent.location)
    };
  }

  _extractTemporalContext(perceptionEvent) {
    const timestamp = new Date(perceptionEvent.timestamp);
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    
    return {
      hour,
      dayOfWeek,
      timeCategory: this._categorizeTime(hour),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      seasonality: this._determineSeason(timestamp)
    };
  }

  _extractBehavioralContext(perceptionEvent) {
    return {
      behaviors: perceptionEvent.behaviors,
      behaviorSequence: this._createBehaviorSequence(perceptionEvent.behaviors),
      behaviorComplexity: this._calculateBehaviorComplexity(perceptionEvent.behaviors),
      suspiciousBehaviorCount: this._countSuspiciousBehaviors(perceptionEvent.behaviors)
    };
  }

  _extractEntityContext(perceptionEvent) {
    return {
      entityType: perceptionEvent.entityType,
      entityId: perceptionEvent.entityId || this._generateEntityId(perceptionEvent),
      entityCharacteristics: perceptionEvent.entityCharacteristics || {},
      isKnownEntity: this._checkIfKnownEntity(perceptionEvent.entityId)
    };
  }

  // Helper methods

  _determineZone(location) {
    const zoneMap = {
      'front_door': 'entry',
      'back_door': 'entry',
      'window': 'perimeter',
      'garage': 'access',
      'yard': 'exterior',
      'street': 'public'
    };
    return zoneMap[location] || 'unknown';
  }

  _categorizeTime(hour) {
    if (hour >= 22 || hour <= 5) return 'night';
    if (hour >= 6 && hour <= 8) return 'morning';
    if (hour >= 9 && hour <= 16) return 'day';
    if (hour >= 17 && hour <= 21) return 'evening';
    return 'unknown';
  }

  _createBehaviorSequence(behaviors) {
    return behaviors.join('->');
  }

  _calculateBehaviorComplexity(behaviors) {
    return behaviors.length + (new Set(behaviors).size * 0.5);
  }

  _countSuspiciousBehaviors(behaviors) {
    const suspiciousBehaviors = ['avoiding_cameras', 'loitering', 'looking_around', 'carrying_tools'];
    return behaviors.filter(b => suspiciousBehaviors.includes(b)).length;
  }

  _calculateContextualRelevance(spatialHistory, temporalHistory, behavioralHistory, entityHistory) {
    const weights = {
      spatial: 0.3,
      temporal: 0.2,
      behavioral: 0.3,
      entity: 0.2
    };
    
    const spatialRelevance = spatialHistory.length > 0 ? 0.8 : 0.2;
    const temporalRelevance = temporalHistory.length > 0 ? 0.7 : 0.3;
    const behavioralRelevance = behavioralHistory.length > 0 ? 0.9 : 0.1;
    const entityRelevance = entityHistory.length > 0 ? 0.6 : 0.4;
    
    return (
      spatialRelevance * weights.spatial +
      temporalRelevance * weights.temporal +
      behavioralRelevance * weights.behavioral +
      entityRelevance * weights.entity
    );
  }

  _extractNormalPatterns(spatialHistory, temporalHistory, behavioralHistory) {
    const normalPatterns = {
      commonLocations: new Map(),
      commonTimes: new Map(),
      commonBehaviors: new Map(),
      normalSequences: []
    };
    
    // Extract patterns from history
    spatialHistory.forEach(entry => {
      if (entry.suspicionLevel < 0.3) {
        const count = normalPatterns.commonLocations.get(entry.location) || 0;
        normalPatterns.commonLocations.set(entry.location, count + 1);
      }
    });
    
    temporalHistory.forEach(entry => {
      if (entry.suspicionLevel < 0.3) {
        const timeKey = this._hashKey(entry.hour, entry.dayOfWeek);
        const count = normalPatterns.commonTimes.get(timeKey) || 0;
        normalPatterns.commonTimes.set(timeKey, count + 1);
      }
    });
    
    behavioralHistory.forEach(entry => {
      if (entry.suspicionLevel < 0.3) {
        entry.behaviors.forEach(behavior => {
          const count = normalPatterns.commonBehaviors.get(behavior) || 0;
          normalPatterns.commonBehaviors.set(behavior, count + 1);
        });
      }
    });
    
    return normalPatterns;
  }

  _extractAnomalyPatterns(spatialHistory, temporalHistory, behavioralHistory) {
    const anomalyPatterns = {
      suspiciousLocations: new Map(),
      suspiciousTimes: new Map(),
      suspiciousBehaviors: new Map(),
      anomalySequences: []
    };
    
    // Extract anomaly patterns from history
    spatialHistory.forEach(entry => {
      if (entry.suspicionLevel > 0.7) {
        const count = anomalyPatterns.suspiciousLocations.get(entry.location) || 0;
        anomalyPatterns.suspiciousLocations.set(entry.location, count + 1);
      }
    });
    
    return anomalyPatterns;
  }

  _generateMemoryId() {
    return `memory-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  _generateEntityId(perceptionEvent) {
    // Generate a consistent entity ID based on characteristics
    const characteristics = JSON.stringify(perceptionEvent.entityCharacteristics || {});
    return `entity-${this._simpleHash(characteristics)}`;
  }

  _simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  _updateMemoryStats() {
    this.memoryStats.totalEvents++;
    // Update other stats as needed
  }

  async _compressMemoriesIfNeeded() {
    // Compress old memories to save space
    if (this.memoryStats.totalEvents % 1000 === 0) {
      await this.memoryCompressor.compressOldMemories();
    }
  }
}

/**
 * Spatial Memory Store
 * Manages location-based memories and spatial patterns
 */
class SpatialMemoryStore {
  constructor() {
    this.memories = new Map(); // location -> memories array
    this.spatialIndex = new Map(); // for efficient spatial queries
  }

  async store(memoryEntry) {
    const location = memoryEntry.location;
    
    if (!this.memories.has(location)) {
      this.memories.set(location, []);
    }
    
    this.memories.get(location).push(memoryEntry);
    
    // Update spatial index
    this._updateSpatialIndex(memoryEntry);
  }

  async getRelevantMemories(spatialContext, lookbackHours) {
    const cutoffTime = Date.now() - (lookbackHours * 60 * 60 * 1000);
    const location = spatialContext.location;
    
    const locationMemories = this.memories.get(location) || [];
    
    return locationMemories
      .filter(memory => memory.timestamp > cutoffTime)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100); // Limit to most recent 100 memories
  }

  getInsights() {
    const insights = {
      totalLocations: this.memories.size,
      mostActiveLocation: null,
      locationActivity: new Map()
    };
    
    let maxActivity = 0;
    for (const [location, memories] of this.memories) {
      const activityCount = memories.length;
      insights.locationActivity.set(location, activityCount);
      
      if (activityCount > maxActivity) {
        maxActivity = activityCount;
        insights.mostActiveLocation = location;
      }
    }
    
    return insights;
  }

  _updateSpatialIndex(memoryEntry) {
    // Update spatial indexing for efficient queries
    const zone = memoryEntry.zone || 'unknown';
    if (!this.spatialIndex.has(zone)) {
      this.spatialIndex.set(zone, []);
    }
    this.spatialIndex.get(zone).push(memoryEntry.memoryId);
  }
}

/**
 * Temporal Memory Store
 * Manages time-based memories and temporal patterns
 */
class TemporalMemoryStore {
  constructor() {
    this.memories = new Map(); // timeKey -> memories array
    this.temporalPatterns = new Map();
  }

  async store(memoryEntry) {
    const timeKey = this._hashKey(memoryEntry.hour, memoryEntry.dayOfWeek);
    
    if (!this.memories.has(timeKey)) {
      this.memories.set(timeKey, []);
    }
    
    this.memories.get(timeKey).push(memoryEntry);
    
    // Update temporal patterns
    this._updateTemporalPatterns(memoryEntry);
  }

  async getRelevantMemories(temporalContext, lookbackHours) {
    const cutoffTime = Date.now() - (lookbackHours * 60 * 60 * 1000);
    const timeKey = this._hashKey(temporalContext.hour, temporalContext.dayOfWeek);
    
    const timeMemories = this.memories.get(timeKey) || [];
    
    return timeMemories
      .filter(memory => memory.timestamp > cutoffTime)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);
  }

  getInsights() {
    return {
      totalTimeSlots: this.memories.size,
      temporalPatterns: this.temporalPatterns,
      peakActivityTimes: this._calculatePeakTimes()
    };
  }

  _updateTemporalPatterns(memoryEntry) {
    const pattern = this._hashKey(memoryEntry.timeCategory, memoryEntry.entityType);
    const count = this.temporalPatterns.get(pattern) || 0;
    this.temporalPatterns.set(pattern, count + 1);
  }

  _calculatePeakTimes() {
    const timeActivity = new Map();
    
    for (const [timeKey, memories] of this.memories) {
      timeActivity.set(timeKey, memories.length);
    }
    
    return Array.from(timeActivity.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }
}

/**
 * Behavioral Memory Store
 * Manages behavior patterns and sequences
 */
class BehavioralMemoryStore {
  constructor() {
    this.behaviorPatterns = new Map();
    this.behaviorSequences = new Map();
    this.memories = [];
  }

  async store(memoryEntry) {
    this.memories.push(memoryEntry);
    
    // Update behavior patterns
    memoryEntry.behaviors.forEach(behavior => {
      const count = this.behaviorPatterns.get(behavior) || 0;
      this.behaviorPatterns.set(behavior, count + 1);
    });
    
    // Update behavior sequences
    const sequence = memoryEntry.behaviorSequence;
    const seqCount = this.behaviorSequences.get(sequence) || 0;
    this.behaviorSequences.set(sequence, seqCount + 1);
  }

  async getRelevantPatterns(behaviors, lookbackHours) {
    const cutoffTime = Date.now() - (lookbackHours * 60 * 60 * 1000);
    
    return this.memories
      .filter(memory => {
        return memory.timestamp > cutoffTime &&
               memory.behaviors.some(b => behaviors.includes(b));
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);
  }

  getInsights() {
    return {
      totalBehaviorPatterns: this.behaviorPatterns.size,
      totalBehaviorSequences: this.behaviorSequences.size,
      mostCommonBehaviors: this._getMostCommonBehaviors(),
      mostCommonSequences: this._getMostCommonSequences()
    };
  }

  _getMostCommonBehaviors() {
    return Array.from(this.behaviorPatterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }

  _getMostCommonSequences() {
    return Array.from(this.behaviorSequences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }
}

/**
 * Entity Memory Store
 * Manages entity profiles and recognition
 */
class EntityMemoryStore {
  constructor() {
    this.entityProfiles = new Map();
    this.memories = [];
  }

  async store(memoryEntry) {
    this.memories.push(memoryEntry);
    
    // Update entity profile
    const entityId = memoryEntry.entityId;
    if (!this.entityProfiles.has(entityId)) {
      this.entityProfiles.set(entityId, {
        entityId,
        entityType: memoryEntry.entityType,
        firstSeen: memoryEntry.timestamp,
        lastSeen: memoryEntry.timestamp,
        totalSightings: 0,
        commonLocations: new Map(),
        commonBehaviors: new Map(),
        suspicionHistory: [],
        feedbackHistory: []
      });
    }
    
    const profile = this.entityProfiles.get(entityId);
    profile.lastSeen = memoryEntry.timestamp;
    profile.totalSightings++;
    
    // Update location frequency
    const locationCount = profile.commonLocations.get(memoryEntry.location) || 0;
    profile.commonLocations.set(memoryEntry.location, locationCount + 1);
    
    // Update behavior frequency
    memoryEntry.behaviors.forEach(behavior => {
      const behaviorCount = profile.commonBehaviors.get(behavior) || 0;
      profile.commonBehaviors.set(behavior, behaviorCount + 1);
    });
    
    // Update suspicion history
    profile.suspicionHistory.push({
      timestamp: memoryEntry.timestamp,
      suspicionLevel: memoryEntry.suspicionLevel
    });
    
    // Update feedback history
    if (memoryEntry.feedback) {
      profile.feedbackHistory.push({
        timestamp: memoryEntry.timestamp,
        feedback: memoryEntry.feedback
      });
    }
  }

  async getRelevantEntities(entityType, spatialContext, lookbackHours) {
    const cutoffTime = Date.now() - (lookbackHours * 60 * 60 * 1000);
    
    return this.memories
      .filter(memory => {
        return memory.timestamp > cutoffTime &&
               (memory.entityType === entityType || memory.location === spatialContext.location);
      })
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 30);
  }

  getInsights() {
    return {
      totalEntityProfiles: this.entityProfiles.size,
      entityTypes: this._getEntityTypeDistribution(),
      mostFrequentEntities: this._getMostFrequentEntities()
    };
  }

  _getEntityTypeDistribution() {
    const distribution = new Map();
    for (const profile of this.entityProfiles.values()) {
      const count = distribution.get(profile.entityType) || 0;
      distribution.set(profile.entityType, count + 1);
    }
    return distribution;
  }

  _getMostFrequentEntities() {
    return Array.from(this.entityProfiles.values())
      .sort((a, b) => b.totalSightings - a.totalSightings)
      .slice(0, 10)
      .map(profile => ({
        entityId: profile.entityId,
        entityType: profile.entityType,
        totalSightings: profile.totalSightings,
        averageSuspicion: this._calculateAverageSuspicion(profile.suspicionHistory)
      }));
  }

  _calculateAverageSuspicion(suspicionHistory) {
    if (suspicionHistory.length === 0) return 0;
    const sum = suspicionHistory.reduce((acc, entry) => acc + entry.suspicionLevel, 0);
    return sum / suspicionHistory.length;
  }
}

/**
 * Contextual Norms Store
 * Manages learned norms and expectations for different contexts
 */
class ContextualNormsStore {
  constructor() {
    this.norms = new Map(); // contextKey -> norm data
  }

  async updateNorms(normUpdate) {
    const contextKey = this._hashKey(normUpdate.location, normUpdate.timeCategory);
    
    if (!this.norms.has(contextKey)) {
      this.norms.set(contextKey, {
        contextKey,
        location: normUpdate.location,
        timeCategory: normUpdate.timeCategory,
        expectedEntityTypes: new Map(),
        expectedBehaviors: new Map(),
        normalSuspicionRange: { min: 1, max: 0 },
        totalObservations: 0,
        lastUpdated: Date.now()
      });
    }
    
    const norm = this.norms.get(contextKey);
    
    // Update expected entity types
    const entityCount = norm.expectedEntityTypes.get(normUpdate.entityType) || 0;
    norm.expectedEntityTypes.set(normUpdate.entityType, entityCount + 1);
    
    // Update expected behaviors
    normUpdate.behaviors.forEach(behavior => {
      const behaviorCount = norm.expectedBehaviors.get(behavior) || 0;
      norm.expectedBehaviors.set(behavior, behaviorCount + 1);
    });
    
    // Update normal suspicion range
    if (normUpdate.suspicionLevel < norm.normalSuspicionRange.min) {
      norm.normalSuspicionRange.min = normUpdate.suspicionLevel;
    }
    if (normUpdate.suspicionLevel > norm.normalSuspicionRange.max) {
      norm.normalSuspicionRange.max = normUpdate.suspicionLevel;
    }
    
    norm.totalObservations++;
    norm.lastUpdated = Date.now();
  }

  async getNorms(spatialContext, temporalContext) {
    const contextKey = this._hashKey(spatialContext.location, temporalContext.timeCategory);
    return this.norms.get(contextKey) || null;
  }
}

/**
 * Adaptive Learning Engine
 * Learns from feedback to improve future assessments
 */
class AdaptiveLearningEngine {
  constructor() {
    this.learningHistory = [];
    this.adaptationRules = new Map();
    this.performanceMetrics = {
      totalFeedback: 0,
      correctAssessments: 0,
      falsePositives: 0,
      falseNegatives: 0,
      accuracy: 0
    };
  }

  async learnFromFeedback(memoryEntry, feedback) {
    this.learningHistory.push({
      timestamp: Date.now(),
      memoryEntry,
      feedback,
      originalAssessment: memoryEntry.cognitiveAssessment
    });
    
    // Update performance metrics
    this._updatePerformanceMetrics(memoryEntry, feedback);
    
    // Generate adaptation rules
    this._generateAdaptationRules(memoryEntry, feedback);
    
    // Apply learning to improve future assessments
    this._applyLearning(memoryEntry, feedback);
  }

  getInsights() {
    return {
      performanceMetrics: this.performanceMetrics,
      totalLearningEvents: this.learningHistory.length,
      adaptationRules: this.adaptationRules.size,
      recentLearning: this.learningHistory.slice(-10)
    };
  }

  _updatePerformanceMetrics(memoryEntry, feedback) {
    this.performanceMetrics.totalFeedback++;
    
    const originalSuspicion = memoryEntry.cognitiveAssessment.suspicionLevel;
    const wasCorrect = this._evaluateCorrectness(originalSuspicion, feedback);
    
    if (wasCorrect) {
      this.performanceMetrics.correctAssessments++;
    } else {
      if (originalSuspicion > 0.5 && feedback.actualThreat === false) {
        this.performanceMetrics.falsePositives++;
      } else if (originalSuspicion <= 0.5 && feedback.actualThreat === true) {
        this.performanceMetrics.falseNegatives++;
      }
    }
    
    this.performanceMetrics.accuracy = 
      this.performanceMetrics.correctAssessments / this.performanceMetrics.totalFeedback;
  }

  _evaluateCorrectness(suspicionLevel, feedback) {
    const threshold = 0.5;
    const predictedThreat = suspicionLevel > threshold;
    return predictedThreat === feedback.actualThreat;
  }

  _generateAdaptationRules(memoryEntry, feedback) {
    // Generate rules based on feedback patterns
    const ruleKey = this._generateRuleKey(memoryEntry);
    
    if (!this.adaptationRules.has(ruleKey)) {
      this.adaptationRules.set(ruleKey, {
        ruleKey,
        conditions: this._extractConditions(memoryEntry),
        adjustments: [],
        confidence: 0
      });
    }
    
    const rule = this.adaptationRules.get(ruleKey);
    rule.adjustments.push({
      timestamp: Date.now(),
      originalSuspicion: memoryEntry.cognitiveAssessment.suspicionLevel,
      feedback: feedback,
      adjustment: this._calculateAdjustment(memoryEntry, feedback)
    });
    
    rule.confidence = this._calculateRuleConfidence(rule.adjustments);
  }

  _generateRuleKey(memoryEntry) {
    const key = this._hashKey(memoryEntry.perceptionEvent.entityType, memoryEntry.spatialContext.location, memoryEntry.temporalContext.timeCategory);
    return key;
  }

  _extractConditions(memoryEntry) {
    return {
      entityType: memoryEntry.perceptionEvent.entityType,
      location: memoryEntry.spatialContext.location,
      timeCategory: memoryEntry.temporalContext.timeCategory,
      behaviors: memoryEntry.perceptionEvent.behaviors
    };
  }

  _calculateAdjustment(memoryEntry, feedback) {
    const originalSuspicion = memoryEntry.cognitiveAssessment.suspicionLevel;
    const targetSuspicion = feedback.actualThreat ? 0.8 : 0.2;
    return targetSuspicion - originalSuspicion;
  }

  _calculateRuleConfidence(adjustments) {
    if (adjustments.length === 0) return 0;
    
    // Calculate confidence based on consistency of adjustments
    const avgAdjustment = adjustments.reduce((sum, adj) => sum + adj.adjustment, 0) / adjustments.length;
    const variance = adjustments.reduce((sum, adj) => sum + Math.pow(adj.adjustment - avgAdjustment, 2), 0) / adjustments.length;
    
    return Math.max(0, 1 - variance); // Lower variance = higher confidence
  }

  _applyLearning(memoryEntry, feedback) {
    // Apply learning to improve future similar assessments
    // This would update the reasoning rules or weights based on feedback
  }
}

/**
 * Memory Compressor
 * Compresses old memories to save space while preserving important patterns
 */
class MemoryCompressor {
  async compressOldMemories() {
    // Implement memory compression logic
    console.log('🗜️ Compressing old memories to optimize storage');
  }
}

/**
 * Memory Retrieval
 * Efficient retrieval of relevant memories
 */
class MemoryRetrieval {
  constructor() {
    this.indexCache = new Map();
  }

  async retrieveRelevantMemories(query, memoryStores) {
    // Implement efficient memory retrieval
    return [];
  }
}

export { 
  ContextualMemorySystem, 
  SpatialMemoryStore, 
  TemporalMemoryStore, 
  BehavioralMemoryStore, 
  EntityMemoryStore, 
  ContextualNormsStore, 
  AdaptiveLearningEngine 
};