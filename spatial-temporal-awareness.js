/**
 * Spatial-Temporal Awareness System
 * 
 * Implements embodied cognition simulation for the cognitive interpreter.
 * This system creates spatial-temporal presence, maintains continuity of awareness,
 * and simulates physical presence for enhanced contextual understanding.
 * 
 * @version 2.0.0
 * @author Goliath Security Systems
 */

class SpatialTemporalAwareness {
  constructor(config) {
    this.config = config;
    
    // Core awareness components
    this.spatialSimulator = new SpatialPresenceSimulator(config.spatial);
    this.temporalTracker = new TemporalContinuityTracker(config.temporal);
    this.embodiedCognition = new EmbodiedCognitionEngine(config.embodied);
    this.awarenessState = new AwarenessStateManager();
    
    // Spatial-temporal memory
    this.spatialMemory = new SpatialMemoryGrid();
    this.temporalMemory = new TemporalEventStream();
    this.contextualMemory = new ContextualAwarenessMemory();
    
    // Presence simulation
    this.virtualPresence = new VirtualPresenceEngine();
    this.attentionManager = new AttentionManager();
    this.perceptualField = new PerceptualFieldSimulator();
    
    // Awareness metrics
    this.awarenessMetrics = new AwarenessMetrics();
    
    console.log('🧭 Spatial-Temporal Awareness System initialized');
  }

  /**
   * Process spatial-temporal event with embodied awareness
   */
  async processWithAwareness(event, spatialContext, temporalContext) {
    const awarenessId = this._generateAwarenessId();
    const startTime = performance.now();
    
    try {
      // Step 1: Establish spatial presence
      const spatialPresence = await this.spatialSimulator.establishPresence(
        spatialContext,
        event
      );
      
      // Step 2: Maintain temporal continuity
      const temporalContinuity = await this.temporalTracker.maintainContinuity(
        temporalContext,
        event,
        spatialPresence
      );
      
      // Step 3: Simulate embodied cognition
      const embodiedResponse = await this.embodiedCognition.processEmbodied(
        event,
        spatialPresence,
        temporalContinuity
      );
      
      // Step 4: Update awareness state
      const awarenessUpdate = await this.awarenessState.updateAwareness(
        spatialPresence,
        temporalContinuity,
        embodiedResponse
      );
      
      // Step 5: Manage attention and focus
      const attentionState = await this.attentionManager.manageAttention(
        event,
        spatialPresence,
        embodiedResponse
      );
      
      // Step 6: Update perceptual field
      const perceptualUpdate = await this.perceptualField.updateField(
        spatialContext,
        temporalContext,
        attentionState
      );
      
      // Step 7: Store in contextual memory
      await this.contextualMemory.storeAwarenessEvent({
        awarenessId,
        event,
        spatialPresence,
        temporalContinuity,
        embodiedResponse,
        attentionState,
        perceptualUpdate
      });
      
      const processingTime = performance.now() - startTime;
      
      const awarenessResult = {
        awarenessId,
        timestamp: Date.now(),
        
        // Core awareness components
        spatialPresence,
        temporalContinuity,
        embodiedResponse,
        
        // State management
        awarenessUpdate,
        attentionState,
        perceptualUpdate,
        
        // Awareness insights
        spatialInsights: this._generateSpatialInsights(spatialPresence),
        temporalInsights: this._generateTemporalInsights(temporalContinuity),
        embodiedInsights: this._generateEmbodiedInsights(embodiedResponse),
        
        // Performance metrics
        processingTime,
        awarenessEfficiency: this._calculateAwarenessEfficiency(processingTime, embodiedResponse)
      };
      
      // Update awareness metrics
      this.awarenessMetrics.recordAwareness(awarenessResult);
      
      return awarenessResult;
      
    } catch (error) {
      throw new Error(`Spatial-temporal awareness processing failed: ${error.message}`);
    }
  }

  /**
   * Get current awareness state
   */
  getCurrentAwarenessState() {
    return {
      spatialState: this.spatialSimulator.getCurrentState(),
      temporalState: this.temporalTracker.getCurrentState(),
      embodiedState: this.embodiedCognition.getCurrentState(),
      attentionState: this.attentionManager.getCurrentState(),
      perceptualState: this.perceptualField.getCurrentState(),
      overallAwareness: this.awarenessState.getOverallState()
    };
  }

  /**
   * Simulate physical presence at location
   */
  async simulatePresenceAt(location, duration = 60000) {
    const presenceId = this._generatePresenceId();
    
    try {
      // Establish virtual presence
      const presence = await this.virtualPresence.establishAt(location, duration);
      
      // Update spatial memory
      await this.spatialMemory.recordPresence(location, presence);
      
      // Adjust perceptual field
      await this.perceptualField.adjustForLocation(location);
      
      // Update attention focus
      await this.attentionManager.focusOnLocation(location);
      
      return {
        presenceId,
        location,
        duration,
        presence,
        established: true,
        startTime: Date.now()
      };
      
    } catch (error) {
      throw new Error(`Presence simulation failed: ${error.message}`);
    }
  }

  /**
   * Get spatial-temporal insights
   */
  getAwarenessInsights() {
    return {
      spatialCoverage: this.spatialSimulator.getCoverageMetrics(),
      temporalContinuity: this.temporalTracker.getContinuityMetrics(),
      embodiedEffectiveness: this.embodiedCognition.getEffectivenessMetrics(),
      attentionEfficiency: this.attentionManager.getEfficiencyMetrics(),
      perceptualAccuracy: this.perceptualField.getAccuracyMetrics(),
      overallPerformance: this.awarenessMetrics.getOverallPerformance()
    };
  }

  // Private methods

  _generateSpatialInsights(spatialPresence) {
    return {
      locationCoverage: spatialPresence.coverage,
      spatialFocus: spatialPresence.focusAreas,
      movementPatterns: spatialPresence.movementAnalysis,
      spatialAnomalies: spatialPresence.anomalies
    };
  }

  _generateTemporalInsights(temporalContinuity) {
    return {
      continuityStrength: temporalContinuity.strength,
      temporalPatterns: temporalContinuity.patterns,
      timelineCoherence: temporalContinuity.coherence,
      temporalAnomalies: temporalContinuity.anomalies
    };
  }

  _generateEmbodiedInsights(embodiedResponse) {
    return {
      embodimentStrength: embodiedResponse.strength,
      cognitiveRealism: embodiedResponse.realism,
      contextualIntegration: embodiedResponse.integration,
      embodiedEffectiveness: embodiedResponse.effectiveness
    };
  }

  _calculateAwarenessEfficiency(processingTime, embodiedResponse) {
    const timeEfficiency = Math.max(0, 1 - (processingTime / 5000)); // 5s max
    const responseQuality = embodiedResponse.effectiveness || 0.5;
    
    return (timeEfficiency + responseQuality) / 2;
  }

  _generateAwarenessId() {
    return `awareness-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  _generatePresenceId() {
    return `presence-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }
}

/**
 * Spatial Presence Simulator
 * Simulates physical presence in space
 */
class SpatialPresenceSimulator {
  constructor(config = {}) {
    this.config = config;
    this.currentLocation = null;
    this.spatialState = new Map();
    this.presenceHistory = [];
    this.spatialModel = new SpatialModel();
  }

  async establishPresence(spatialContext, event) {
    const presence = {
      location: spatialContext.location,
      coordinates: spatialContext.coordinates,
      coverage: await this._calculateSpatialCoverage(spatialContext),
      focusAreas: await this._identifyFocusAreas(spatialContext, event),
      movementAnalysis: await this._analyzeMovement(spatialContext),
      anomalies: await this._detectSpatialAnomalies(spatialContext, event),
      confidence: 0.8,
      timestamp: Date.now()
    };
    
    // Update current location
    this.currentLocation = spatialContext.location;
    
    // Store in spatial state
    this.spatialState.set(spatialContext.location, presence);
    
    // Add to presence history
    this.presenceHistory.push(presence);
    
    // Limit history size
    if (this.presenceHistory.length > 100) {
      this.presenceHistory.shift();
    }
    
    return presence;
  }

  getCurrentState() {
    return {
      currentLocation: this.currentLocation,
      spatialCoverage: this._calculateOverallCoverage(),
      activeLocations: Array.from(this.spatialState.keys()),
      presenceStrength: this._calculatePresenceStrength()
    };
  }

  getCoverageMetrics() {
    return {
      totalLocations: this.spatialState.size,
      averageCoverage: this._calculateAverageCoverage(),
      coverageDistribution: this._getCoverageDistribution(),
      spatialEfficiency: this._calculateSpatialEfficiency()
    };
  }

  async _calculateSpatialCoverage(spatialContext) {
    // Calculate how much of the space is covered by awareness
    const baseRadius = 10; // meters
    const contextualMultiplier = this._getContextualMultiplier(spatialContext);
    
    return {
      radius: baseRadius * contextualMultiplier,
      area: Math.PI * Math.pow(baseRadius * contextualMultiplier, 2),
      quality: contextualMultiplier
    };
  }

  async _identifyFocusAreas(spatialContext, event) {
    const focusAreas = [];
    
    // Primary focus on event location
    if (event.location) {
      focusAreas.push({
        location: event.location,
        type: 'event_primary',
        intensity: 0.9,
        reason: 'Event occurrence location'
      });
    }
    
    // Secondary focus on access points
    if (spatialContext.accessPoints) {
      spatialContext.accessPoints.forEach(point => {
        focusAreas.push({
          location: point,
          type: 'access_secondary',
          intensity: 0.6,
          reason: 'Potential access or egress point'
        });
      });
    }
    
    // Tertiary focus on blind spots
    if (spatialContext.blindSpots) {
      spatialContext.blindSpots.forEach(spot => {
        focusAreas.push({
          location: spot,
          type: 'blind_spot_tertiary',
          intensity: 0.4,
          reason: 'Area requiring additional attention'
        });
      });
    }
    
    return focusAreas;
  }

  async _analyzeMovement(spatialContext) {
    const analysis = {
      patterns: [],
      velocity: 0,
      direction: null,
      predictedPath: null
    };
    
    // Analyze movement patterns from recent history
    const recentPresence = this.presenceHistory.slice(-5);
    
    if (recentPresence.length >= 2) {
      // Calculate movement velocity
      const distances = [];
      const times = [];
      
      for (let i = 1; i < recentPresence.length; i++) {
        const prev = recentPresence[i - 1];
        const curr = recentPresence[i];
        
        if (prev.coordinates && curr.coordinates) {
          const distance = this._calculateDistance(prev.coordinates, curr.coordinates);
          const time = (curr.timestamp - prev.timestamp) / 1000; // seconds
          
          distances.push(distance);
          times.push(time);
        }
      }
      
      if (distances.length > 0) {
        analysis.velocity = distances.reduce((sum, d, i) => sum + (d / times[i]), 0) / distances.length;
      }
      
      // Identify movement patterns
      analysis.patterns = this._identifyMovementPatterns(recentPresence);
    }
    
    return analysis;
  }

  async _detectSpatialAnomalies(spatialContext, event) {
    const anomalies = [];
    
    // Check for unusual spatial patterns
    if (spatialContext.unusualAccess) {
      anomalies.push({
        type: 'unusual_access',
        severity: 0.7,
        description: 'Access from unusual location or route',
        location: spatialContext.location
      });
    }
    
    // Check for spatial-temporal mismatches
    if (this._isSpatialTemporalMismatch(spatialContext, event)) {
      anomalies.push({
        type: 'spatial_temporal_mismatch',
        severity: 0.6,
        description: 'Spatial activity inconsistent with temporal patterns',
        location: spatialContext.location
      });
    }
    
    return anomalies;
  }

  _getContextualMultiplier(spatialContext) {
    let multiplier = 1.0;
    
    // Adjust based on lighting
    if (spatialContext.lighting === 'low') multiplier *= 0.7;
    if (spatialContext.lighting === 'high') multiplier *= 1.2;
    
    // Adjust based on visibility
    if (spatialContext.visibility === 'poor') multiplier *= 0.6;
    if (spatialContext.visibility === 'excellent') multiplier *= 1.3;
    
    // Adjust based on complexity
    if (spatialContext.complexity === 'high') multiplier *= 0.8;
    if (spatialContext.complexity === 'low') multiplier *= 1.1;
    
    return Math.max(0.3, Math.min(2.0, multiplier));
  }

  _calculateDistance(coord1, coord2) {
    const dx = coord2.x - coord1.x;
    const dy = coord2.y - coord1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  _identifyMovementPatterns(presenceHistory) {
    const patterns = [];
    
    // Look for circular movement
    if (this._isCircularMovement(presenceHistory)) {
      patterns.push({
        type: 'circular',
        confidence: 0.8,
        description: 'Circular or looping movement pattern'
      });
    }
    
    // Look for linear movement
    if (this._isLinearMovement(presenceHistory)) {
      patterns.push({
        type: 'linear',
        confidence: 0.7,
        description: 'Direct linear movement pattern'
      });
    }
    
    // Look for erratic movement
    if (this._isErraticMovement(presenceHistory)) {
      patterns.push({
        type: 'erratic',
        confidence: 0.6,
        description: 'Erratic or unpredictable movement pattern'
      });
    }
    
    return patterns;
  }

  _isCircularMovement(history) {
    if (history.length < 4) return false;
    
    // Simple heuristic: check if we return close to starting position
    const start = history[0];
    const end = history[history.length - 1];
    
    if (start.coordinates && end.coordinates) {
      const distance = this._calculateDistance(start.coordinates, end.coordinates);
      return distance < 5; // Within 5 units of starting position
    }
    
    return false;
  }

  _isLinearMovement(history) {
    if (history.length < 3) return false;
    
    // Check if movement is generally in same direction
    const directions = [];
    
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      
      if (prev.coordinates && curr.coordinates) {
        const dx = curr.coordinates.x - prev.coordinates.x;
        const dy = curr.coordinates.y - prev.coordinates.y;
        const angle = Math.atan2(dy, dx);
        directions.push(angle);
      }
    }
    
    if (directions.length < 2) return false;
    
    // Check if directions are consistent (within 45 degrees)
    const avgDirection = directions.reduce((sum, dir) => sum + dir, 0) / directions.length;
    const deviations = directions.map(dir => Math.abs(dir - avgDirection));
    const maxDeviation = Math.max(...deviations);
    
    return maxDeviation < Math.PI / 4; // 45 degrees
  }

  _isErraticMovement(history) {
    if (history.length < 4) return false;
    
    // Check for high variance in movement patterns
    const velocities = [];
    
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      
      if (prev.coordinates && curr.coordinates) {
        const distance = this._calculateDistance(prev.coordinates, curr.coordinates);
        const time = (curr.timestamp - prev.timestamp) / 1000;
        velocities.push(distance / time);
      }
    }
    
    if (velocities.length < 3) return false;
    
    const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const variance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length;
    
    return variance > avgVelocity; // High variance relative to average
  }

  _isSpatialTemporalMismatch(spatialContext, event) {
    // Check if spatial activity is unusual for the time
    const hour = new Date().getHours();
    
    // Business hours activity in residential area
    if (spatialContext.zoneType === 'residential' && hour >= 9 && hour <= 17) {
      return true;
    }
    
    // Late night activity in business area
    if (spatialContext.zoneType === 'business' && (hour >= 22 || hour <= 6)) {
      return true;
    }
    
    return false;
  }

  _calculateOverallCoverage() {
    if (this.spatialState.size === 0) return 0;
    
    const coverages = Array.from(this.spatialState.values()).map(state => state.coverage.quality);
    return coverages.reduce((sum, coverage) => sum + coverage, 0) / coverages.length;
  }

  _calculateAverageCoverage() {
    return this._calculateOverallCoverage();
  }

  _getCoverageDistribution() {
    const coverages = Array.from(this.spatialState.values()).map(state => state.coverage.quality);
    
    return {
      min: Math.min(...coverages),
      max: Math.max(...coverages),
      average: this._calculateAverageCoverage(),
      standardDeviation: this._calculateStandardDeviation(coverages)
    };
  }

  _calculateSpatialEfficiency() {
    const totalArea = Array.from(this.spatialState.values())
      .reduce((sum, state) => sum + state.coverage.area, 0);
    const uniqueLocations = this.spatialState.size;
    
    return uniqueLocations > 0 ? totalArea / uniqueLocations : 0;
  }

  _calculatePresenceStrength() {
    if (this.presenceHistory.length === 0) return 0;
    
    const recentPresence = this.presenceHistory.slice(-10);
    const avgConfidence = recentPresence.reduce((sum, p) => sum + p.confidence, 0) / recentPresence.length;
    
    return avgConfidence;
  }

  _calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }
}

/**
 * Temporal Continuity Tracker
 * Maintains temporal awareness and continuity
 */
class TemporalContinuityTracker {
  constructor(config = {}) {
    this.config = config;
    this.temporalState = {
      currentTime: Date.now(),
      timelineCoherence: 1.0,
      continuityStrength: 1.0
    };
    this.eventTimeline = [];
    this.temporalPatterns = new Map();
  }

  async maintainContinuity(temporalContext, event, spatialPresence) {
    const continuity = {
      timestamp: Date.now(),
      strength: await this._calculateContinuityStrength(temporalContext, event),
      patterns: await this._identifyTemporalPatterns(temporalContext, event),
      coherence: await this._assessTimelineCoherence(temporalContext, event),
      anomalies: await this._detectTemporalAnomalies(temporalContext, event),
      contextualAlignment: await this._assessContextualAlignment(temporalContext, spatialPresence)
    };
    
    // Update temporal state
    this.temporalState.currentTime = Date.now();
    this.temporalState.continuityStrength = continuity.strength;
    this.temporalState.timelineCoherence = continuity.coherence;
    
    // Add to event timeline
    this.eventTimeline.push({
      timestamp: continuity.timestamp,
      event,
      temporalContext,
      continuity
    });
    
    // Limit timeline size
    if (this.eventTimeline.length > 1000) {
      this.eventTimeline.shift();
    }
    
    // Update temporal patterns
    await this._updateTemporalPatterns(temporalContext, event);
    
    return continuity;
  }

  getCurrentState() {
    return {
      currentTime: this.temporalState.currentTime,
      continuityStrength: this.temporalState.continuityStrength,
      timelineCoherence: this.temporalState.timelineCoherence,
      activePatterns: Array.from(this.temporalPatterns.keys()),
      timelineLength: this.eventTimeline.length
    };
  }

  getContinuityMetrics() {
    return {
      averageContinuity: this._calculateAverageContinuity(),
      continuityTrend: this._getContinuityTrend(),
      patternStability: this._getPatternStability(),
      temporalEfficiency: this._calculateTemporalEfficiency()
    };
  }

  async _calculateContinuityStrength(temporalContext, event) {
    let strength = 1.0;
    
    // Check for temporal gaps
    if (this.eventTimeline.length > 0) {
      const lastEvent = this.eventTimeline[this.eventTimeline.length - 1];
      const timeDiff = Date.now() - lastEvent.timestamp;
      
      // Reduce strength for large time gaps
      if (timeDiff > 300000) { // 5 minutes
        strength *= 0.7;
      } else if (timeDiff > 60000) { // 1 minute
        strength *= 0.9;
      }
    }
    
    // Check for contextual consistency
    const contextualConsistency = await this._assessContextualConsistency(temporalContext);
    strength *= contextualConsistency;
    
    return Math.max(0.1, Math.min(1.0, strength));
  }

  async _identifyTemporalPatterns(temporalContext, event) {
    const patterns = [];
    
    // Daily patterns
    const dailyPattern = await this._identifyDailyPattern(temporalContext);
    if (dailyPattern) {
      patterns.push(dailyPattern);
    }
    
    // Weekly patterns
    const weeklyPattern = await this._identifyWeeklyPattern(temporalContext);
    if (weeklyPattern) {
      patterns.push(weeklyPattern);
    }
    
    // Event sequence patterns
    const sequencePattern = await this._identifySequencePattern(event);
    if (sequencePattern) {
      patterns.push(sequencePattern);
    }
    
    return patterns;
  }

  async _assessTimelineCoherence(temporalContext, event) {
    let coherence = 1.0;
    
    // Check for logical temporal sequence
    if (this.eventTimeline.length >= 2) {
      const recentEvents = this.eventTimeline.slice(-5);
      
      // Check for chronological consistency
      for (let i = 1; i < recentEvents.length; i++) {
        if (recentEvents[i].timestamp < recentEvents[i - 1].timestamp) {
          coherence *= 0.8; // Penalize non-chronological events
        }
      }
      
      // Check for causal relationships
      const causalCoherence = await this._assessCausalCoherence(recentEvents);
      coherence *= causalCoherence;
    }
    
    return Math.max(0.1, Math.min(1.0, coherence));
  }

  async _detectTemporalAnomalies(temporalContext, event) {
    const anomalies = [];
    
    // Check for unusual timing
    if (await this._isUnusualTiming(temporalContext)) {
      anomalies.push({
        type: 'unusual_timing',
        severity: 0.6,
        description: 'Event occurring at unusual time',
        timestamp: temporalContext.timestamp
      });
    }
    
    // Check for rapid sequence anomalies
    if (await this._isRapidSequenceAnomaly(event)) {
      anomalies.push({
        type: 'rapid_sequence',
        severity: 0.7,
        description: 'Unusually rapid sequence of events',
        timestamp: Date.now()
      });
    }
    
    // Check for temporal pattern breaks
    if (await this._isPatternBreak(temporalContext, event)) {
      anomalies.push({
        type: 'pattern_break',
        severity: 0.5,
        description: 'Break in established temporal pattern',
        timestamp: temporalContext.timestamp
      });
    }
    
    return anomalies;
  }

  async _assessContextualAlignment(temporalContext, spatialPresence) {
    let alignment = 1.0;
    
    // Check if temporal context aligns with spatial context
    if (spatialPresence && spatialPresence.location) {
      const expectedActivity = await this._getExpectedActivityLevel(
        temporalContext,
        spatialPresence.location
      );
      
      const actualActivity = temporalContext.activityLevel || 0.5;
      const difference = Math.abs(expectedActivity - actualActivity);
      
      alignment = Math.max(0.1, 1.0 - difference);
    }
    
    return alignment;
  }

  async _updateTemporalPatterns(temporalContext, event) {
    const hour = new Date(temporalContext.timestamp).getHours();
    const dayOfWeek = new Date(temporalContext.timestamp).getDay();
    
    // Update hourly patterns
    const hourlyKey = `hour_${hour}`;
    if (!this.temporalPatterns.has(hourlyKey)) {
      this.temporalPatterns.set(hourlyKey, {
        occurrences: 0,
        averageActivity: 0,
        eventTypes: new Map()
      });
    }
    
    const hourlyPattern = this.temporalPatterns.get(hourlyKey);
    hourlyPattern.occurrences++;
    hourlyPattern.averageActivity = (hourlyPattern.averageActivity + (temporalContext.activityLevel || 0.5)) / 2;
    
    // Update event type tracking
    const eventType = event.type || 'unknown';
    const currentCount = hourlyPattern.eventTypes.get(eventType) || 0;
    hourlyPattern.eventTypes.set(eventType, currentCount + 1);
    
    // Update daily patterns
    const dailyKey = `day_${dayOfWeek}`;
    if (!this.temporalPatterns.has(dailyKey)) {
      this.temporalPatterns.set(dailyKey, {
        occurrences: 0,
        averageActivity: 0,
        eventTypes: new Map()
      });
    }
    
    const dailyPattern = this.temporalPatterns.get(dailyKey);
    dailyPattern.occurrences++;
    dailyPattern.averageActivity = (dailyPattern.averageActivity + (temporalContext.activityLevel || 0.5)) / 2;
    
    const dailyEventCount = dailyPattern.eventTypes.get(eventType) || 0;
    dailyPattern.eventTypes.set(eventType, dailyEventCount + 1);
  }

  async _assessContextualConsistency(temporalContext) {
    // Check consistency with established patterns
    const hour = new Date(temporalContext.timestamp).getHours();
    const hourlyKey = `hour_${hour}`;
    
    if (this.temporalPatterns.has(hourlyKey)) {
      const pattern = this.temporalPatterns.get(hourlyKey);
      const expectedActivity = pattern.averageActivity;
      const actualActivity = temporalContext.activityLevel || 0.5;
      
      const consistency = 1.0 - Math.abs(expectedActivity - actualActivity);
      return Math.max(0.1, consistency);
    }
    
    return 0.7; // Default consistency for new patterns
  }

  async _identifyDailyPattern(temporalContext) {
    const hour = new Date(temporalContext.timestamp).getHours();
    const hourlyKey = `hour_${hour}`;
    
    if (this.temporalPatterns.has(hourlyKey)) {
      const pattern = this.temporalPatterns.get(hourlyKey);
      
      if (pattern.occurrences >= 5) { // Minimum occurrences for pattern recognition
        return {
          type: 'daily',
          hour,
          confidence: Math.min(1.0, pattern.occurrences / 20),
          averageActivity: pattern.averageActivity,
          description: `Daily pattern for hour ${hour}`
        };
      }
    }
    
    return null;
  }

  async _identifyWeeklyPattern(temporalContext) {
    const dayOfWeek = new Date(temporalContext.timestamp).getDay();
    const dailyKey = `day_${dayOfWeek}`;
    
    if (this.temporalPatterns.has(dailyKey)) {
      const pattern = this.temporalPatterns.get(dailyKey);
      
      if (pattern.occurrences >= 3) { // Minimum occurrences for weekly pattern
        return {
          type: 'weekly',
          dayOfWeek,
          confidence: Math.min(1.0, pattern.occurrences / 10),
          averageActivity: pattern.averageActivity,
          description: `Weekly pattern for day ${dayOfWeek}`
        };
      }
    }
    
    return null;
  }

  async _identifySequencePattern(event) {
    if (this.eventTimeline.length < 3) return null;
    
    const recentEvents = this.eventTimeline.slice(-3);
    const eventTypes = recentEvents.map(e => e.event.type);
    
    // Look for repeating sequences
    const sequenceKey = eventTypes.join('->');
    
    // Check if this sequence has occurred before
    const similarSequences = this.eventTimeline.filter(e => {
      const index = this.eventTimeline.indexOf(e);
      if (index < 2) return false;
      
      const prevSequence = this.eventTimeline.slice(index - 2, index + 1)
        .map(se => se.event.type).join('->');
      
      return prevSequence === sequenceKey;
    });
    
    if (similarSequences.length >= 2) {
      return {
        type: 'sequence',
        sequence: eventTypes,
        confidence: Math.min(1.0, similarSequences.length / 5),
        description: `Event sequence pattern: ${sequenceKey}`
      };
    }
    
    return null;
  }

  async _assessCausalCoherence(recentEvents) {
    let coherence = 1.0;
    
    // Simple causal relationship assessment
    for (let i = 1; i < recentEvents.length; i++) {
      const prev = recentEvents[i - 1];
      const curr = recentEvents[i];
      
      // Check if events are causally related
      const causalRelation = await this._assessCausalRelation(prev.event, curr.event);
      coherence *= causalRelation;
    }
    
    return coherence;
  }

  async _assessCausalRelation(prevEvent, currEvent) {
    // Simple heuristic for causal relationships
    const causalPairs = {
      'motion_detected': ['door_opened', 'alarm_triggered'],
      'door_opened': ['person_entered', 'motion_detected'],
      'person_entered': ['motion_detected', 'activity_detected']
    };
    
    const expectedNext = causalPairs[prevEvent.type] || [];
    
    if (expectedNext.includes(currEvent.type)) {
      return 1.0; // Strong causal relationship
    } else if (prevEvent.type === currEvent.type) {
      return 0.8; // Same event type (moderate relationship)
    } else {
      return 0.6; // Weak or no obvious causal relationship
    }
  }

  async _isUnusualTiming(temporalContext) {
    const hour = new Date(temporalContext.timestamp).getHours();
    
    // Define unusual hours (very late night/early morning)
    return hour >= 2 && hour <= 5;
  }

  async _isRapidSequenceAnomaly(event) {
    if (this.eventTimeline.length < 3) return false;
    
    const recentEvents = this.eventTimeline.slice(-3);
    const timeDiffs = [];
    
    for (let i = 1; i < recentEvents.length; i++) {
      const diff = recentEvents[i].timestamp - recentEvents[i - 1].timestamp;
      timeDiffs.push(diff);
    }
    
    // Check if all events occurred within a very short time
    const maxDiff = Math.max(...timeDiffs);
    return maxDiff < 5000; // Less than 5 seconds between events
  }

  async _isPatternBreak(temporalContext, event) {
    const hour = new Date(temporalContext.timestamp).getHours();
    const hourlyKey = `hour_${hour}`;
    
    if (this.temporalPatterns.has(hourlyKey)) {
      const pattern = this.temporalPatterns.get(hourlyKey);
      const expectedEventTypes = Array.from(pattern.eventTypes.keys());
      
      // Check if current event type is unusual for this hour
      return !expectedEventTypes.includes(event.type) && pattern.occurrences >= 10;
    }
    
    return false;
  }

  async _getExpectedActivityLevel(temporalContext, location) {
    const hour = new Date(temporalContext.timestamp).getHours();
    
    // Simple heuristic based on location type and time
    const locationActivityProfiles = {
      'residential': {
        6: 0.3, 7: 0.5, 8: 0.7, 9: 0.4, 10: 0.3, 11: 0.3, 12: 0.4,
        13: 0.4, 14: 0.3, 15: 0.3, 16: 0.4, 17: 0.6, 18: 0.8, 19: 0.9,
        20: 0.8, 21: 0.7, 22: 0.5, 23: 0.3, 0: 0.1, 1: 0.1, 2: 0.1,
        3: 0.1, 4: 0.1, 5: 0.2
      },
      'business': {
        6: 0.1, 7: 0.3, 8: 0.7, 9: 0.9, 10: 0.9, 11: 0.9, 12: 0.8,
        13: 0.8, 14: 0.9, 15: 0.9, 16: 0.9, 17: 0.7, 18: 0.4, 19: 0.2,
        20: 0.1, 21: 0.1, 22: 0.1, 23: 0.1, 0: 0.1, 1: 0.1, 2: 0.1,
        3: 0.1, 4: 0.1, 5: 0.1
      }
    };
    
    const profile = locationActivityProfiles[location] || locationActivityProfiles['residential'];
    return profile[hour] || 0.3;
  }

  _calculateAverageContinuity() {
    if (this.eventTimeline.length === 0) return 0;
    
    const recentEvents = this.eventTimeline.slice(-20);
    const continuityValues = recentEvents.map(e => e.continuity.strength);
    
    return continuityValues.reduce((sum, val) => sum + val, 0) / continuityValues.length;
  }

  _getContinuityTrend() {
    if (this.eventTimeline.length < 10) return 'insufficient_data';
    
    const recent = this.eventTimeline.slice(-5).map(e => e.continuity.strength);
    const older = this.eventTimeline.slice(-10, -5).map(e => e.continuity.strength);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'improving';
    if (recentAvg < olderAvg * 0.9) return 'declining';
    return 'stable';
  }

  _getPatternStability() {
    const patternStabilities = Array.from(this.temporalPatterns.values()).map(pattern => {
      return Math.min(1.0, pattern.occurrences / 20); // Stability based on occurrences
    });
    
    if (patternStabilities.length === 0) return 0;
    
    return patternStabilities.reduce((sum, stability) => sum + stability, 0) / patternStabilities.length;
  }

  _calculateTemporalEfficiency() {
    if (this.eventTimeline.length === 0) return 0;
    
    const recentEvents = this.eventTimeline.slice(-10);
    const avgCoherence = recentEvents.reduce((sum, e) => sum + e.continuity.coherence, 0) / recentEvents.length;
    const avgContinuity = recentEvents.reduce((sum, e) => sum + e.continuity.strength, 0) / recentEvents.length;
    
    return (avgCoherence + avgContinuity) / 2;
  }
}

/**
 * Embodied Cognition Engine
 * Simulates embodied cognitive processes
 */
class EmbodiedCognitionEngine {
  constructor(config = {}) {
    this.config = config;
    this.embodiedState = {
      presence: 0.8,
      awareness: 0.8,
      intuition: 0.7
    };
    this.cognitiveModels = new Map();
    this.embodiedMemory = [];
  }

  async processEmbodied(event, spatialPresence, temporalContinuity) {
    const embodied = {
      strength: await this._calculateEmbodimentStrength(event, spatialPresence),
      realism: await this._assessCognitiveRealism(event, temporalContinuity),
      integration: await this._assessContextualIntegration(spatialPresence, temporalContinuity),
      effectiveness: 0,
      insights: await this._generateEmbodiedInsights(event, spatialPresence, temporalContinuity),
      intuition: await this._processIntuition(event, spatialPresence, temporalContinuity)
    };
    
    // Calculate overall effectiveness
    embodied.effectiveness = (embodied.strength + embodied.realism + embodied.integration) / 3;
    
    // Update embodied state
    this.embodiedState.presence = (this.embodiedState.presence + embodied.strength) / 2;
    this.embodiedState.awareness = (this.embodiedState.awareness + embodied.integration) / 2;
    this.embodiedState.intuition = (this.embodiedState.intuition + embodied.intuition.strength) / 2;
    
    // Store in embodied memory
    this.embodiedMemory.push({
      timestamp: Date.now(),
      event,
      spatialPresence,
      temporalContinuity,
      embodied
    });
    
    // Limit memory size
    if (this.embodiedMemory.length > 100) {
      this.embodiedMemory.shift();
    }
    
    return embodied;
  }

  getCurrentState() {
    return {
      presence: this.embodiedState.presence,
      awareness: this.embodiedState.awareness,
      intuition: this.embodiedState.intuition,
      memorySize: this.embodiedMemory.length,
      cognitiveModels: Array.from(this.cognitiveModels.keys())
    };
  }

  getEffectivenessMetrics() {
    if (this.embodiedMemory.length === 0) {
      return {
        averageEffectiveness: 0,
        effectivenessTrend: 'no_data',
        strengthDistribution: { min: 0, max: 0, avg: 0 },
        realismScore: 0
      };
    }
    
    const recent = this.embodiedMemory.slice(-20);
    const effectiveness = recent.map(m => m.embodied.effectiveness);
    const strengths = recent.map(m => m.embodied.strength);
    const realism = recent.map(m => m.embodied.realism);
    
    return {
      averageEffectiveness: effectiveness.reduce((sum, e) => sum + e, 0) / effectiveness.length,
      effectivenessTrend: this._getEffectivenessTrend(),
      strengthDistribution: {
        min: Math.min(...strengths),
        max: Math.max(...strengths),
        avg: strengths.reduce((sum, s) => sum + s, 0) / strengths.length
      },
      realismScore: realism.reduce((sum, r) => sum + r, 0) / realism.length
    };
  }

  async _calculateEmbodimentStrength(event, spatialPresence) {
    let strength = 0.7; // Base strength
    
    // Increase strength based on spatial presence quality
    if (spatialPresence && spatialPresence.coverage) {
      strength += spatialPresence.coverage.quality * 0.2;
    }
    
    // Increase strength based on focus areas
    if (spatialPresence && spatialPresence.focusAreas) {
      const avgIntensity = spatialPresence.focusAreas.reduce((sum, area) => sum + area.intensity, 0) / spatialPresence.focusAreas.length;
      strength += avgIntensity * 0.1;
    }
    
    // Adjust based on event complexity
    const eventComplexity = await this._assessEventComplexity(event);
    strength += eventComplexity * 0.1;
    
    return Math.max(0.1, Math.min(1.0, strength));
  }

  async _assessCognitiveRealism(event, temporalContinuity) {
    let realism = 0.8; // Base realism
    
    // Adjust based on temporal continuity
    if (temporalContinuity) {
      realism = (realism + temporalContinuity.strength + temporalContinuity.coherence) / 3;
    }
    
    // Adjust based on pattern recognition
    if (temporalContinuity && temporalContinuity.patterns) {
      const patternConfidence = temporalContinuity.patterns.reduce((sum, p) => sum + p.confidence, 0) / temporalContinuity.patterns.length;
      realism = (realism + patternConfidence) / 2;
    }
    
    return Math.max(0.1, Math.min(1.0, realism));
  }

  async _assessContextualIntegration(spatialPresence, temporalContinuity) {
    let integration = 0.7; // Base integration
    
    // Spatial-temporal alignment
    if (spatialPresence && temporalContinuity) {
      const alignment = temporalContinuity.contextualAlignment || 0.7;
      integration = (integration + alignment) / 2;
    }
    
    // Anomaly consistency
    const spatialAnomalies = spatialPresence?.anomalies?.length || 0;
    const temporalAnomalies = temporalContinuity?.anomalies?.length || 0;
    
    if (spatialAnomalies > 0 && temporalAnomalies > 0) {
      integration += 0.1; // Consistent anomalies across dimensions
    }
    
    return Math.max(0.1, Math.min(1.0, integration));
  }

  async _generateEmbodiedInsights(event, spatialPresence, temporalContinuity) {
    const insights = {
      spatialIntuition: await this._generateSpatialIntuition(event, spatialPresence),
      temporalIntuition: await this._generateTemporalIntuition(event, temporalContinuity),
      holisticAssessment: await this._generateHolisticAssessment(event, spatialPresence, temporalContinuity),
      embodiedRecommendations: await this._generateEmbodiedRecommendations(event, spatialPresence, temporalContinuity)
    };
    
    return insights;
  }

  async _processIntuition(event, spatialPresence, temporalContinuity) {
    const intuition = {
      strength: 0.7,
      confidence: 0.6,
      insights: [],
      hunches: []
    };
    
    // Generate intuitive insights
    if (spatialPresence?.anomalies?.length > 0) {
      intuition.insights.push({
        type: 'spatial_concern',
        description: 'Something feels off about the spatial patterns',
        confidence: 0.6
      });
    }
    
    if (temporalContinuity?.anomalies?.length > 0) {
      intuition.insights.push({
        type: 'temporal_concern',
        description: 'The timing doesn\'t feel right',
        confidence: 0.7
      });
    }
    
    // Generate hunches based on embodied memory
    const similarSituations = await this._findSimilarSituations(event, spatialPresence, temporalContinuity);
    
    if (similarSituations.length > 0) {
      const avgOutcome = similarSituations.reduce((sum, sit) => sum + (sit.threatLevel || 0.5), 0) / similarSituations.length;
      
      intuition.hunches.push({
        type: 'pattern_recognition',
        description: `This reminds me of ${similarSituations.length} similar situations`,
        expectedOutcome: avgOutcome,
        confidence: Math.min(1.0, similarSituations.length / 10)
      });
    }
    
    // Calculate overall intuition strength
    intuition.strength = (intuition.insights.length * 0.3 + intuition.hunches.length * 0.4 + 0.3);
    intuition.confidence = (intuition.insights.reduce((sum, i) => sum + i.confidence, 0) + 
                           intuition.hunches.reduce((sum, h) => sum + h.confidence, 0)) / 
                          (intuition.insights.length + intuition.hunches.length + 1);
    
    return intuition;
  }

  async _assessEventComplexity(event) {
    let complexity = 0.5; // Base complexity
    
    // Increase complexity based on event properties
    if (event.multipleActors) complexity += 0.2;
    if (event.simultaneousEvents) complexity += 0.2;
    if (event.unusualCharacteristics) complexity += 0.1;
    
    return Math.max(0.1, Math.min(1.0, complexity));
  }

  async _generateSpatialIntuition(event, spatialPresence) {
    const intuition = [];
    
    if (spatialPresence?.movementAnalysis?.patterns) {
      spatialPresence.movementAnalysis.patterns.forEach(pattern => {
        if (pattern.type === 'erratic') {
          intuition.push({
            insight: 'Erratic movement suggests uncertainty or evasion',
            confidence: pattern.confidence,
            reasoning: 'Embodied experience of movement patterns'
          });
        } else if (pattern.type === 'circular') {
          intuition.push({
            insight: 'Circular movement may indicate surveillance or confusion',
            confidence: pattern.confidence,
            reasoning: 'Spatial behavior analysis'
          });
        }
      });
    }
    
    return intuition;
  }

  async _generateTemporalIntuition(event, temporalContinuity) {
    const intuition = [];
    
    if (temporalContinuity?.anomalies) {
      temporalContinuity.anomalies.forEach(anomaly => {
        if (anomaly.type === 'unusual_timing') {
          intuition.push({
            insight: 'Unusual timing suggests deliberate avoidance of normal hours',
            confidence: 0.7,
            reasoning: 'Temporal pattern analysis'
          });
        } else if (anomaly.type === 'rapid_sequence') {
          intuition.push({
            insight: 'Rapid sequence may indicate urgency or panic',
            confidence: 0.8,
            reasoning: 'Temporal behavior analysis'
          });
        }
      });
    }
    
    return intuition;
  }

  async _generateHolisticAssessment(event, spatialPresence, temporalContinuity) {
    const assessment = {
      overallFeeling: 'neutral',
      confidence: 0.6,
      keyFactors: [],
      recommendation: 'continue_monitoring'
    };
    
    // Combine spatial and temporal insights
    const spatialConcerns = spatialPresence?.anomalies?.length || 0;
    const temporalConcerns = temporalContinuity?.anomalies?.length || 0;
    const totalConcerns = spatialConcerns + temporalConcerns;
    
    if (totalConcerns >= 3) {
      assessment.overallFeeling = 'suspicious';
      assessment.confidence = 0.8;
      assessment.recommendation = 'escalate_attention';
    } else if (totalConcerns >= 1) {
      assessment.overallFeeling = 'cautious';
      assessment.confidence = 0.7;
      assessment.recommendation = 'increase_monitoring';
    }
    
    // Add key factors
    if (spatialConcerns > 0) {
      assessment.keyFactors.push('Spatial anomalies detected');
    }
    if (temporalConcerns > 0) {
      assessment.keyFactors.push('Temporal anomalies detected');
    }
    
    return assessment;
  }

  async _generateEmbodiedRecommendations(event, spatialPresence, temporalContinuity) {
    const recommendations = [];
    
    // Spatial recommendations
    if (spatialPresence?.focusAreas) {
      const highIntensityAreas = spatialPresence.focusAreas.filter(area => area.intensity > 0.7);
      if (highIntensityAreas.length > 0) {
        recommendations.push({
          type: 'spatial_focus',
          action: `Focus attention on ${highIntensityAreas.map(a => a.location).join(', ')}`,
          priority: 'high',
          reasoning: 'High-intensity focus areas identified'
        });
      }
    }
    
    // Temporal recommendations
    if (temporalContinuity?.patterns) {
      const strongPatterns = temporalContinuity.patterns.filter(p => p.confidence > 0.8);
      if (strongPatterns.length > 0) {
        recommendations.push({
          type: 'temporal_pattern',
          action: 'Monitor for pattern deviations',
          priority: 'medium',
          reasoning: 'Strong temporal patterns established'
        });
      }
    }
    
    // Combined recommendations
    const spatialAnomalies = spatialPresence?.anomalies?.length || 0;
    const temporalAnomalies = temporalContinuity?.anomalies?.length || 0;
    
    if (spatialAnomalies > 0 && temporalAnomalies > 0) {
      recommendations.push({
        type: 'multi_dimensional',
        action: 'Investigate correlation between spatial and temporal anomalies',
        priority: 'high',
        reasoning: 'Anomalies detected across multiple dimensions'
      });
    }
    
    return recommendations;
  }

  async _findSimilarSituations(event, spatialPresence, temporalContinuity) {
    const similar = [];
    
    // Search embodied memory for similar situations
    this.embodiedMemory.forEach(memory => {
      let similarity = 0;
      let factors = 0;
      
      // Compare event types
      if (memory.event.type === event.type) {
        similarity += 0.3;
        factors++;
      }
      
      // Compare spatial characteristics
      if (memory.spatialPresence && spatialPresence) {
        if (memory.spatialPresence.location === spatialPresence.location) {
          similarity += 0.2;
          factors++;
        }
        
        // Compare movement patterns
        const memoryPatterns = memory.spatialPresence.movementAnalysis?.patterns || [];
        const currentPatterns = spatialPresence.movementAnalysis?.patterns || [];
        
        const patternOverlap = this._calculatePatternOverlap(memoryPatterns, currentPatterns);
        similarity += patternOverlap * 0.2;
        factors++;
      }
      
      // Compare temporal characteristics
      if (memory.temporalContinuity && temporalContinuity) {
        const memoryHour = new Date(memory.timestamp).getHours();
        const currentHour = new Date().getHours();
        
        if (Math.abs(memoryHour - currentHour) <= 2) {
          similarity += 0.2;
          factors++;
        }
      }
      
      // Calculate final similarity
      const finalSimilarity = factors > 0 ? similarity / factors : 0;
      
      if (finalSimilarity > 0.5) {
        similar.push({
          memory,
          similarity: finalSimilarity,
          threatLevel: memory.embodied?.effectiveness || 0.5
        });
      }
    });
    
    return similar.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }

  _calculatePatternOverlap(patterns1, patterns2) {
    if (patterns1.length === 0 || patterns2.length === 0) return 0;
    
    const types1 = patterns1.map(p => p.type);
    const types2 = patterns2.map(p => p.type);
    
    const overlap = types1.filter(type => types2.includes(type)).length;
    const total = Math.max(types1.length, types2.length);
    
    return overlap / total;
  }

  _getEffectivenessTrend() {
    if (this.embodiedMemory.length < 10) return 'insufficient_data';
    
    const recent = this.embodiedMemory.slice(-5).map(m => m.embodied.effectiveness);
    const older = this.embodiedMemory.slice(-10, -5).map(m => m.embodied.effectiveness);
    
    const recentAvg = recent.reduce((sum, e) => sum + e, 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + e, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'improving';
    if (recentAvg < olderAvg * 0.9) return 'declining';
    return 'stable';
  }
}

/**
 * Awareness State Manager
 * Manages overall awareness state
 */
class AwarenessStateManager {
  constructor() {
    this.state = {
      overallAwareness: 0.8,
      spatialAwareness: 0.8,
      temporalAwareness: 0.8,
      embodiedAwareness: 0.8,
      lastUpdate: Date.now()
    };
  }

  async updateAwareness(spatialPresence, temporalContinuity, embodiedResponse) {
    const previousState = { ...this.state };
    
    // Update individual awareness components
    this.state.spatialAwareness = spatialPresence.confidence || 0.8;
    this.state.temporalAwareness = temporalContinuity.strength || 0.8;
    this.state.embodiedAwareness = embodiedResponse.effectiveness || 0.8;
    
    // Calculate overall awareness
    this.state.overallAwareness = (
      this.state.spatialAwareness +
      this.state.temporalAwareness +
      this.state.embodiedAwareness
    ) / 3;
    
    this.state.lastUpdate = Date.now();
    
    return {
      previousState,
      currentState: { ...this.state },
      changes: this._calculateStateChanges(previousState, this.state)
    };
  }

  getOverallState() {
    return { ...this.state };
  }

  _calculateStateChanges(previous, current) {
    return {
      overallChange: Math.abs(current.overallAwareness - previous.overallAwareness),
      spatialChange: Math.abs(current.spatialAwareness - previous.spatialAwareness),
      temporalChange: Math.abs(current.temporalAwareness - previous.temporalAwareness),
      embodiedChange: Math.abs(current.embodiedAwareness - previous.embodiedAwareness)
    };
  }
}

/**
 * Attention Manager
 * Manages attention and focus
 */
class AttentionManager {
  constructor() {
    this.attentionState = {
      currentFocus: null,
      focusIntensity: 0.5,
      attentionSpan: 30000, // 30 seconds
      distractionLevel: 0.1
    };
    this.focusHistory = [];
  }

  async manageAttention(event, spatialPresence, embodiedResponse) {
    const attention = {
      focus: await this._determineFocus(event, spatialPresence),
      intensity: await this._calculateIntensity(event, embodiedResponse),
      duration: await this._estimateDuration(event),
      distractions: await this._identifyDistractions(event, spatialPresence)
    };
    
    // Update attention state
    this.attentionState.currentFocus = attention.focus;
    this.attentionState.focusIntensity = attention.intensity;
    this.attentionState.distractionLevel = attention.distractions.length * 0.1;
    
    // Record in focus history
    this.focusHistory.push({
      timestamp: Date.now(),
      focus: attention.focus,
      intensity: attention.intensity,
      event
    });
    
    // Limit history size
    if (this.focusHistory.length > 50) {
      this.focusHistory.shift();
    }
    
    return attention;
  }

  async focusOnLocation(location) {
    this.attentionState.currentFocus = {
      type: 'location',
      target: location,
      reason: 'manual_focus'
    };
    this.attentionState.focusIntensity = 0.9;
  }

  getCurrentState() {
    return { ...this.attentionState };
  }

  getEfficiencyMetrics() {
    if (this.focusHistory.length === 0) {
      return {
        averageIntensity: 0,
        focusStability: 0,
        attentionEfficiency: 0
      };
    }
    
    const recent = this.focusHistory.slice(-10);
    const intensities = recent.map(f => f.intensity);
    
    return {
      averageIntensity: intensities.reduce((sum, i) => sum + i, 0) / intensities.length,
      focusStability: this._calculateFocusStability(recent),
      attentionEfficiency: this._calculateAttentionEfficiency(recent)
    };
  }

  async _determineFocus(event, spatialPresence) {
    // Primary focus on event
    const focus = {
      type: 'event',
      target: event,
      reason: 'event_occurrence',
      priority: 0.8
    };
    
    // Adjust focus based on spatial anomalies
    if (spatialPresence?.anomalies?.length > 0) {
      focus.priority += 0.1;
      focus.reason = 'event_with_spatial_anomalies';
    }
    
    return focus;
  }

  async _calculateIntensity(event, embodiedResponse) {
    let intensity = 0.6; // Base intensity
    
    // Increase based on embodied response effectiveness
    intensity += embodiedResponse.effectiveness * 0.3;
    
    // Increase based on event severity
    if (event.severity) {
      intensity += event.severity * 0.2;
    }
    
    return Math.max(0.1, Math.min(1.0, intensity));
  }

  async _estimateDuration(event) {
    // Base duration of 30 seconds
    let duration = 30000;
    
    // Extend for complex events
    if (event.complexity && event.complexity > 0.7) {
      duration *= 1.5;
    }
    
    // Extend for high-priority events
    if (event.priority && event.priority > 0.8) {
      duration *= 2;
    }
    
    return duration;
  }

  async _identifyDistractions(event, spatialPresence) {
    const distractions = [];
    
    // Multiple focus areas can be distracting
    if (spatialPresence?.focusAreas?.length > 3) {
      distractions.push({
        type: 'multiple_focus_areas',
        severity: 0.3,
        description: 'Multiple areas requiring attention'
      });
    }
    
    return distractions;
  }

  _calculateFocusStability(focusHistory) {
    if (focusHistory.length < 2) return 1.0;
    
    let stability = 1.0;
    
    for (let i = 1; i < focusHistory.length; i++) {
      const prev = focusHistory[i - 1];
      const curr = focusHistory[i];
      
      // Check for focus changes
      if (prev.focus.type !== curr.focus.type) {
        stability -= 0.1;
      }
      
      // Check for intensity fluctuations
      const intensityDiff = Math.abs(curr.intensity - prev.intensity);
      if (intensityDiff > 0.3) {
        stability -= 0.05;
      }
    }
    
    return Math.max(0.1, stability);
  }

  _calculateAttentionEfficiency(focusHistory) {
    if (focusHistory.length === 0) return 0;
    
    const avgIntensity = focusHistory.reduce((sum, f) => sum + f.intensity, 0) / focusHistory.length;
    const stability = this._calculateFocusStability(focusHistory);
    
    return (avgIntensity + stability) / 2;
  }
}

/**
 * Perceptual Field Simulator
 * Simulates perceptual field and awareness
 */
class PerceptualFieldSimulator {
  constructor() {
    this.field = {
      radius: 50, // meters
      resolution: 1.0,
      clarity: 0.8,
      coverage: new Map()
    };
    this.fieldHistory = [];
  }

  async updateField(spatialContext, temporalContext, attentionState) {
    const update = {
      timestamp: Date.now(),
      radius: await this._calculateFieldRadius(spatialContext, attentionState),
      resolution: await this._calculateResolution(spatialContext, temporalContext),
      clarity: await this._calculateClarity(spatialContext, attentionState),
      coverage: await this._updateCoverage(spatialContext)
    };
    
    // Update field state
    this.field.radius = update.radius;
    this.field.resolution = update.resolution;
    this.field.clarity = update.clarity;
    this.field.coverage = update.coverage;
    
    // Record in history
    this.fieldHistory.push(update);
    
    // Limit history size
    if (this.fieldHistory.length > 100) {
      this.fieldHistory.shift();
    }
    
    return update;
  }

  async adjustForLocation(location) {
    // Adjust field parameters for specific location
    this.field.coverage.set(location, {
      quality: 0.9,
      timestamp: Date.now(),
      reason: 'location_focus'
    });
  }

  getCurrentState() {
    return {
      radius: this.field.radius,
      resolution: this.field.resolution,
      clarity: this.field.clarity,
      coverageSize: this.field.coverage.size
    };
  }

  getAccuracyMetrics() {
    if (this.fieldHistory.length === 0) {
      return {
        averageClarity: 0,
        averageResolution: 0,
        fieldStability: 0
      };
    }
    
    const recent = this.fieldHistory.slice(-20);
    
    return {
      averageClarity: recent.reduce((sum, f) => sum + f.clarity, 0) / recent.length,
      averageResolution: recent.reduce((sum, f) => sum + f.resolution, 0) / recent.length,
      fieldStability: this._calculateFieldStability(recent)
    };
  }

  async _calculateFieldRadius(spatialContext, attentionState) {
    let radius = 50; // Base radius
    
    // Adjust based on attention intensity
    if (attentionState.intensity) {
      radius *= (0.5 + attentionState.intensity * 0.5);
    }
    
    // Adjust based on spatial complexity
    if (spatialContext.complexity) {
      radius *= (1.5 - spatialContext.complexity * 0.5);
    }
    
    return Math.max(10, Math.min(200, radius));
  }

  async _calculateResolution(spatialContext, temporalContext) {
    let resolution = 1.0; // Base resolution
    
    // Adjust based on lighting conditions
    if (spatialContext.lighting === 'low') {
      resolution *= 0.7;
    } else if (spatialContext.lighting === 'high') {
      resolution *= 1.2;
    }
    
    // Adjust based on time of day
    const hour = new Date(temporalContext.timestamp).getHours();
    if (hour >= 22 || hour <= 6) {
      resolution *= 0.8; // Reduced resolution at night
    }
    
    return Math.max(0.1, Math.min(2.0, resolution));
  }

  async _calculateClarity(spatialContext, attentionState) {
    let clarity = 0.8; // Base clarity
    
    // Adjust based on attention focus
    if (attentionState.focusIntensity) {
      clarity = (clarity + attentionState.focusIntensity) / 2;
    }
    
    // Adjust based on distractions
    if (attentionState.distractionLevel) {
      clarity *= (1.0 - attentionState.distractionLevel * 0.5);
    }
    
    return Math.max(0.1, Math.min(1.0, clarity));
  }

  async _updateCoverage(spatialContext) {
    const coverage = new Map(this.field.coverage);
    
    // Add current location to coverage
    if (spatialContext.location) {
      coverage.set(spatialContext.location, {
        quality: 0.8,
        timestamp: Date.now(),
        reason: 'current_location'
      });
    }
    
    // Age existing coverage
    const now = Date.now();
    const maxAge = 300000; // 5 minutes
    
    coverage.forEach((value, key) => {
      const age = now - value.timestamp;
      if (age > maxAge) {
        coverage.delete(key);
      } else {
        // Reduce quality over time
        value.quality *= Math.max(0.1, 1.0 - (age / maxAge) * 0.5);
      }
    });
    
    return coverage;
  }

  _calculateFieldStability(fieldHistory) {
    if (fieldHistory.length < 2) return 1.0;
    
    let stability = 1.0;
    
    for (let i = 1; i < fieldHistory.length; i++) {
      const prev = fieldHistory[i - 1];
      const curr = fieldHistory[i];
      
      // Check for radius changes
      const radiusChange = Math.abs(curr.radius - prev.radius) / prev.radius;
      if (radiusChange > 0.2) {
        stability -= 0.05;
      }
      
      // Check for clarity changes
      const clarityChange = Math.abs(curr.clarity - prev.clarity);
      if (clarityChange > 0.2) {
        stability -= 0.05;
      }
    }
    
    return Math.max(0.1, stability);
  }
}

/**
 * Supporting classes for spatial-temporal awareness
 */
class SpatialMemoryGrid {
  constructor() {
    this.grid = new Map();
    this.cellSize = 5; // 5 meter cells
  }

  async recordPresence(location, presence) {
    const cellKey = this._getCellKey(location);
    
    if (!this.grid.has(cellKey)) {
      this.grid.set(cellKey, {
        location,
        presenceHistory: [],
        averagePresence: 0
      });
    }
    
    const cell = this.grid.get(cellKey);
    cell.presenceHistory.push({
      timestamp: Date.now(),
      presence
    });
    
    // Limit history size
    if (cell.presenceHistory.length > 20) {
      cell.presenceHistory.shift();
    }
    
    // Update average
    cell.averagePresence = cell.presenceHistory.reduce((sum, p) => sum + (p.presence.confidence || 0.5), 0) / cell.presenceHistory.length;
  }

  _getCellKey(location) {
    if (typeof location === 'string') {
      return location;
    }
    
    if (location.coordinates) {
      const x = Math.floor(location.coordinates.x / this.cellSize);
      const y = Math.floor(location.coordinates.y / this.cellSize);
      return `${x},${y}`;
    }
    
    return 'unknown';
  }
}

class TemporalEventStream {
  constructor() {
    this.stream = [];
    this.maxSize = 1000;
  }

  addEvent(event, timestamp = Date.now()) {
    this.stream.push({
      timestamp,
      event
    });
    
    // Maintain size limit
    if (this.stream.length > this.maxSize) {
      this.stream.shift();
    }
  }

  getRecentEvents(timeWindow = 3600000) { // 1 hour default
    const cutoff = Date.now() - timeWindow;
    return this.stream.filter(item => item.timestamp >= cutoff);
  }
}

class ContextualAwarenessMemory {
  constructor() {
    this.memory = [];
    this.maxSize = 500;
  }

  async storeAwarenessEvent(awarenessData) {
    this.memory.push({
      timestamp: Date.now(),
      ...awarenessData
    });
    
    // Maintain size limit
    if (this.memory.length > this.maxSize) {
      this.memory.shift();
    }
  }

  getRecentAwareness(count = 10) {
    return this.memory.slice(-count);
  }
}

class VirtualPresenceEngine {
  constructor() {
    this.activePresences = new Map();
  }

  async establishAt(location, duration) {
    const presenceId = `presence-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const presence = {
      id: presenceId,
      location,
      startTime: Date.now(),
      duration,
      strength: 0.8,
      active: true
    };
    
    this.activePresences.set(presenceId, presence);
    
    // Auto-expire after duration
    setTimeout(() => {
      if (this.activePresences.has(presenceId)) {
        this.activePresences.get(presenceId).active = false;
      }
    }, duration);
    
    return presence;
  }

  getActivePresences() {
    return Array.from(this.activePresences.values()).filter(p => p.active);
  }
}

class SpatialModel {
  constructor() {
    this.model = {
      zones: new Map(),
      connections: new Map(),
      landmarks: new Map()
    };
  }

  addZone(zoneId, properties) {
    this.model.zones.set(zoneId, properties);
  }

  getZone(zoneId) {
    return this.model.zones.get(zoneId);
  }
}

class AwarenessMetrics {
  constructor() {
    this.metrics = {
      totalProcessed: 0,
      averageProcessingTime: 0,
      averageEfficiency: 0,
      performanceHistory: []
    };
  }

  recordAwareness(awarenessResult) {
    this.metrics.totalProcessed++;
    
    // Update averages
    this.metrics.averageProcessingTime = (
      this.metrics.averageProcessingTime + awarenessResult.processingTime
    ) / 2;
    
    this.metrics.averageEfficiency = (
      this.metrics.averageEfficiency + awarenessResult.awarenessEfficiency
    ) / 2;
    
    // Record in history
    this.metrics.performanceHistory.push({
      timestamp: awarenessResult.timestamp,
      processingTime: awarenessResult.processingTime,
      efficiency: awarenessResult.awarenessEfficiency
    });
    
    // Limit history size
    if (this.metrics.performanceHistory.length > 100) {
      this.metrics.performanceHistory.shift();
    }
  }

  getOverallPerformance() {
    return {
      totalProcessed: this.metrics.totalProcessed,
      averageProcessingTime: this.metrics.averageProcessingTime,
      averageEfficiency: this.metrics.averageEfficiency,
      performanceTrend: this._getPerformanceTrend()
    };
  }

  _getPerformanceTrend() {
    if (this.metrics.performanceHistory.length < 10) return 'insufficient_data';
    
    const recent = this.metrics.performanceHistory.slice(-5);
    const older = this.metrics.performanceHistory.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, p) => sum + p.efficiency, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.efficiency, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'improving';
    if (recentAvg < olderAvg * 0.9) return 'declining';
    return 'stable';
  }
}

module.exports = {
  SpatialTemporalAwareness,
  SpatialPresenceSimulator,
  TemporalContinuityTracker,
  EmbodiedCognitionEngine,
  AwarenessStateManager,
  AttentionManager,
  PerceptualFieldSimulator,
  SpatialMemoryGrid,
  TemporalEventStream,
  ContextualAwarenessMemory,
  VirtualPresenceEngine,
  SpatialModel,
  AwarenessMetrics
};