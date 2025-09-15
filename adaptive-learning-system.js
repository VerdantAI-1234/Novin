/**
 * Adaptive Learning System
 * 
 * Implements continuous learning and norm updating for the cognitive interpreter.
 * This system learns from feedback, adapts to environmental changes, and evolves
 * behavioral baselines to maintain accuracy over time.
 * 
 * @version 2.0.0
 * @author Goliath Security Systems
 */

class AdaptiveLearningSystem {
  constructor(config) {
    this.config = config;
    
    // Core learning components
    this.normUpdater = new NormUpdater();
    this.patternEvolver = new PatternEvolver();
    this.feedbackProcessor = new FeedbackProcessor();
    this.environmentalAdapter = new EnvironmentalAdapter();
    
    // Learning state management
    this.learningState = new LearningState();
    this.adaptationHistory = new Map();
    this.performanceMetrics = new PerformanceMetrics();
    
    // Learning parameters
    this.learningRate = config.learningRate || 0.1;
    this.adaptationThreshold = config.adaptationThreshold || 0.05;
    this.forgettingFactor = config.forgettingFactor || 0.95;
    
    // Norm categories for different types of learning
    this.normCategories = {
      behavioral: new BehavioralNorms(),
      temporal: new TemporalNorms(),
      spatial: new SpatialNorms(),
      contextual: new ContextualNorms(),
      environmental: new EnvironmentalNorms()
    };
    
    // Auto-save integration
    this.autoSaveSystem = null;
    this.componentId = 'adaptive-learning';
    
    console.log('🧠 Adaptive Learning System initialized');
  }

  /**
   * Process feedback and update learning models
   */
  async processFeedback(assessmentId, feedback, contextualData) {
    const learningId = this._generateLearningId();
    const startTime = performance.now();
    
    try {
      // Step 1: Process and validate feedback
      const processedFeedback = await this.feedbackProcessor.processFeedback(
        feedback,
        assessmentId,
        contextualData
      );
      
      // Step 2: Update behavioral norms
      const behavioralUpdates = await this.normUpdater.updateBehavioralNorms(
        processedFeedback,
        contextualData
      );
      
      // Step 3: Evolve pattern recognition
      const patternUpdates = await this.patternEvolver.evolvePatterns(
        processedFeedback,
        behavioralUpdates
      );
      
      // Step 4: Adapt to environmental changes
      const environmentalUpdates = await this.environmentalAdapter.adaptToEnvironment(
        processedFeedback,
        contextualData
      );
      
      // Step 5: Update learning state
      const stateUpdate = await this.learningState.updateState(
        processedFeedback,
        behavioralUpdates,
        patternUpdates,
        environmentalUpdates
      );
      
      // Step 6: Calculate learning impact
      const learningImpact = await this._calculateLearningImpact(
        behavioralUpdates,
        patternUpdates,
        environmentalUpdates
      );
      
      const processingTime = performance.now() - startTime;
      
      const learningResult = {
        learningId,
        assessmentId,
        timestamp: Date.now(),
        
        // Feedback processing results
        processedFeedback,
        
        // Learning updates
        behavioralUpdates,
        patternUpdates,
        environmentalUpdates,
        stateUpdate,
        
        // Learning metrics
        learningImpact,
        adaptationStrength: this._calculateAdaptationStrength(learningImpact),
        confidenceChange: this._calculateConfidenceChange(processedFeedback),
        
        // Performance tracking
        processingTime,
        learningEfficiency: this._calculateLearningEfficiency(learningImpact, processingTime)
      };
      
      // Store adaptation history
      this.adaptationHistory.set(learningId, learningResult);
      
      // Update performance metrics
      this.performanceMetrics.recordLearning(learningResult);
      
      // Mark as changed for auto-save
      this._markChanged({
        type: 'feedback_processed',
        learningId,
        assessmentId,
        hasSignificantChange: learningResult.adaptationStrength > 0.5,
        source: contextualData?.source || 'user',
        timestamp: Date.now()
      });
      
      return learningResult;
      
    } catch (error) {
      throw new Error(`Adaptive learning failed: ${error.message}`);
    }
  }

  /**
   * Continuously update norms based on observed patterns
   */
  async updateNormsContinuously(observationData, timeWindow = 3600000) { // 1 hour default
    const updateId = this._generateUpdateId();
    
    try {
      // Collect recent observations within time window
      const recentObservations = await this._collectRecentObservations(timeWindow);
      
      // Update each norm category
      const normUpdates = {};
      
      for (const [category, normManager] of Object.entries(this.normCategories)) {
        normUpdates[category] = await normManager.updateNorms(
          recentObservations,
          observationData,
          this.learningRate
        );
      }
      
      // Calculate overall norm drift
      const normDrift = this._calculateNormDrift(normUpdates);
      
      // Apply forgetting factor to old patterns
      await this._applyForgetting();
      
      return {
        updateId,
        timestamp: Date.now(),
        normUpdates,
        normDrift,
        observationCount: recentObservations.length,
        adaptationLevel: this._categorizeAdaptationLevel(normDrift)
      };
      
    } catch (error) {
      throw new Error(`Continuous norm update failed: ${error.message}`);
    }
  }

  /**
   * Get current learning insights and performance
   */
  getLearningInsights() {
    return {
      totalAdaptations: this.adaptationHistory.size,
      learningEfficiency: this.performanceMetrics.getAverageEfficiency(),
      adaptationTrends: this.performanceMetrics.getAdaptationTrends(),
      normStability: this._assessNormStability(),
      learningVelocity: this.performanceMetrics.getLearningVelocity(),
      performanceImprovement: this.performanceMetrics.getPerformanceImprovement()
    };
  }

  /**
   * Get current norms for all categories
   */
  getCurrentNorms() {
    const norms = {};
    
    Object.entries(this.normCategories).forEach(([category, normManager]) => {
      norms[category] = normManager.getCurrentNorms();
    });
    
    return norms;
  }

  /**
   * Validate learning effectiveness
   */
  async validateLearningEffectiveness(validationCriteria) {
    const validation = {
      effective: true,
      score: 0,
      issues: [],
      strengths: []
    };
    
    // Check learning efficiency
    const avgEfficiency = this.performanceMetrics.getAverageEfficiency();
    if (validationCriteria.minEfficiency && avgEfficiency < validationCriteria.minEfficiency) {
      validation.issues.push(`Learning efficiency ${Math.round(avgEfficiency * 100)}% below required ${Math.round(validationCriteria.minEfficiency * 100)}%`);
      validation.effective = false;
    }
    
    // Check adaptation responsiveness
    const adaptationTrends = this.performanceMetrics.getAdaptationTrends();
    if (validationCriteria.maxAdaptationDelay && adaptationTrends.averageDelay > validationCriteria.maxAdaptationDelay) {
      validation.issues.push(`Adaptation delay ${adaptationTrends.averageDelay}ms exceeds maximum ${validationCriteria.maxAdaptationDelay}ms`);
      validation.effective = false;
    }
    
    // Check norm stability
    const normStability = this._assessNormStability();
    if (validationCriteria.minStability && normStability < validationCriteria.minStability) {
      validation.issues.push(`Norm stability ${Math.round(normStability * 100)}% below required ${Math.round(validationCriteria.minStability * 100)}%`);
      validation.effective = false;
    }
    
    // Identify strengths
    if (avgEfficiency >= 0.8) {
      validation.strengths.push('High learning efficiency');
    }
    if (adaptationTrends.averageDelay < 1000) {
      validation.strengths.push('Fast adaptation response');
    }
    if (normStability >= 0.8) {
      validation.strengths.push('Stable norm evolution');
    }
    
    validation.score = validation.effective ? 1.0 - (validation.issues.length * 0.2) : 0.5;
    
    return validation;
  }

  // Private methods

  async _calculateLearningImpact(behavioralUpdates, patternUpdates, environmentalUpdates) {
    const impact = {
      behavioral: this._calculateUpdateMagnitude(behavioralUpdates),
      pattern: this._calculateUpdateMagnitude(patternUpdates),
      environmental: this._calculateUpdateMagnitude(environmentalUpdates),
      overall: 0
    };
    
    impact.overall = (impact.behavioral + impact.pattern + impact.environmental) / 3;
    
    return impact;
  }

  _calculateUpdateMagnitude(updates) {
    if (!updates || !updates.changes) return 0;
    
    return updates.changes.reduce((sum, change) => {
      return sum + Math.abs(change.magnitude || 0);
    }, 0) / updates.changes.length;
  }

  _calculateAdaptationStrength(learningImpact) {
    const overall = learningImpact.overall;
    
    if (overall >= 0.3) return 'strong';
    if (overall >= 0.15) return 'moderate';
    if (overall >= 0.05) return 'weak';
    return 'minimal';
  }

  _calculateConfidenceChange(processedFeedback) {
    if (processedFeedback.accurate) {
      return 0.05; // Increase confidence for accurate predictions
    } else {
      return -0.1; // Decrease confidence for inaccurate predictions
    }
  }

  _calculateLearningEfficiency(learningImpact, processingTime) {
    // Efficiency = impact per unit time
    const timeInSeconds = processingTime / 1000;
    return learningImpact.overall / Math.max(timeInSeconds, 0.001);
  }

  async _collectRecentObservations(timeWindow) {
    const cutoffTime = Date.now() - timeWindow;
    const observations = [];
    
    // Collect from adaptation history
    this.adaptationHistory.forEach(adaptation => {
      if (adaptation.timestamp >= cutoffTime) {
        observations.push({
          timestamp: adaptation.timestamp,
          type: 'adaptation',
          data: adaptation
        });
      }
    });
    
    return observations;
  }

  _calculateNormDrift(normUpdates) {
    const driftValues = Object.values(normUpdates).map(update => {
      return update.drift || 0;
    });
    
    return driftValues.reduce((sum, drift) => sum + Math.abs(drift), 0) / driftValues.length;
  }

  async _applyForgetting() {
    // Apply forgetting factor to reduce influence of old patterns
    Object.values(this.normCategories).forEach(normManager => {
      normManager.applyForgetting(this.forgettingFactor);
    });
  }

  _categorizeAdaptationLevel(normDrift) {
    if (normDrift >= 0.2) return 'high';
    if (normDrift >= 0.1) return 'medium';
    if (normDrift >= 0.05) return 'low';
    return 'minimal';
  }

  _assessNormStability() {
    const stabilityScores = Object.values(this.normCategories).map(normManager => {
      return normManager.getStabilityScore();
    });
    
    return stabilityScores.reduce((sum, score) => sum + score, 0) / stabilityScores.length;
  }

  _generateLearningId() {
    return `learning-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  _generateUpdateId() {
    return `update-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Initialize auto-save system integration
   * @param {AutoSaveSystem} autoSaveSystem - Auto-save system instance
   */
  initializeAutoSave(autoSaveSystem) {
    this.autoSaveSystem = autoSaveSystem;
    autoSaveSystem.registerComponent(this.componentId, this);
    console.log('💾 Adaptive Learning System registered for auto-save');
  }

  /**
   * Get current state for saving
   * Required by AutoSaveSystem
   */
  async getSaveState() {
    return {
      learningState: this.learningState.getState ? this.learningState.getState() : {},
      adaptationHistory: Array.from(this.adaptationHistory.entries()),
      performanceMetrics: this.performanceMetrics.getState ? this.performanceMetrics.getState() : {},
      learningRate: this.learningRate,
      adaptationThreshold: this.adaptationThreshold,
      forgettingFactor: this.forgettingFactor,
      normCategories: Object.fromEntries(
        Object.entries(this.normCategories).map(([key, norm]) => [
          key, 
          norm.getState ? norm.getState() : {}
        ])
      ),
      timestamp: Date.now(),
      version: '1.0.0'
    };
  }

  /**
   * Restore state from saved data
   * Required by AutoSaveSystem
   */
  async restoreFromSave(savedState) {
    if (!savedState) return;

    // Restore learning parameters
    if (savedState.learningRate !== undefined) this.learningRate = savedState.learningRate;
    if (savedState.adaptationThreshold !== undefined) this.adaptationThreshold = savedState.adaptationThreshold;
    if (savedState.forgettingFactor !== undefined) this.forgettingFactor = savedState.forgettingFactor;

    // Restore adaptation history
    if (savedState.adaptationHistory) {
      this.adaptationHistory = new Map(savedState.adaptationHistory);
    }

    // Restore component states if they support it
    const restorePromises = [];

    if (savedState.learningState && this.learningState.restoreState) {
      restorePromises.push(this.learningState.restoreState(savedState.learningState));
    }

    if (savedState.performanceMetrics && this.performanceMetrics.restoreState) {
      restorePromises.push(this.performanceMetrics.restoreState(savedState.performanceMetrics));
    }

    if (savedState.normCategories) {
      for (const [key, normState] of Object.entries(savedState.normCategories)) {
        if (this.normCategories[key] && this.normCategories[key].restoreState) {
          restorePromises.push(this.normCategories[key].restoreState(normState));
        }
      }
    }

    await Promise.all(restorePromises);
    console.log('📂 Adaptive Learning System state restored');
  }

  /**
   * Mark learning system as changed (triggers auto-save)
   * @param {Object} changeDetails - Details about the change
   */
  _markChanged(changeDetails = {}) {
    if (this.autoSaveSystem) {
      this.autoSaveSystem.markChanged(this.componentId, {
        ...changeDetails,
        isDevinChange: changeDetails.source === 'devin' || changeDetails.isAiGenerated
      });
    }
  }
}
}

/**
 * Norm Updater
 * Updates behavioral and contextual norms based on feedback
 */
class NormUpdater {
  async updateBehavioralNorms(processedFeedback, contextualData) {
    const updates = {
      changes: [],
      confidence: 0,
      impact: 0
    };
    
    // Update based on feedback accuracy
    if (processedFeedback.accurate === false) {
      // Incorrect prediction - adjust norms
      const adjustment = this._calculateNormAdjustment(processedFeedback, contextualData);
      
      updates.changes.push({
        type: 'behavioral_baseline',
        description: 'Adjusted behavioral baseline based on feedback',
        magnitude: adjustment.magnitude,
        direction: adjustment.direction,
        reasoning: adjustment.reasoning
      });
      
      updates.impact = adjustment.magnitude;
    }
    
    // Update confidence based on feedback pattern
    updates.confidence = this._calculateNormConfidence(processedFeedback);
    
    return updates;
  }

  _calculateNormAdjustment(processedFeedback, contextualData) {
    const predicted = processedFeedback.predictedThreat;
    const actual = processedFeedback.actualThreat;
    
    let magnitude = 0.1; // Base adjustment
    let direction = 'neutral';
    let reasoning = '';
    
    if (predicted && !actual) {
      // False positive - relax norms
      magnitude = 0.15;
      direction = 'relax';
      reasoning = 'False positive detected - relaxing behavioral norms to reduce sensitivity';
    } else if (!predicted && actual) {
      // False negative - tighten norms
      magnitude = 0.2;
      direction = 'tighten';
      reasoning = 'False negative detected - tightening behavioral norms to increase sensitivity';
    }
    
    return { magnitude, direction, reasoning };
  }

  _calculateNormConfidence(processedFeedback) {
    // Base confidence on feedback accuracy and consistency
    let confidence = 0.7; // Base confidence
    
    if (processedFeedback.accurate) {
      confidence += 0.1;
    } else {
      confidence -= 0.2;
    }
    
    // Adjust based on feedback consistency
    if (processedFeedback.consistencyScore) {
      confidence = (confidence + processedFeedback.consistencyScore) / 2;
    }
    
    return Math.max(0.1, Math.min(1.0, confidence));
  }
}

/**
 * Pattern Evolver
 * Evolves pattern recognition based on new data
 */
class PatternEvolver {
  constructor() {
    this.patternLibrary = new Map();
    this.evolutionHistory = [];
  }

  async evolvePatterns(processedFeedback, behavioralUpdates) {
    const evolution = {
      newPatterns: [],
      modifiedPatterns: [],
      removedPatterns: [],
      confidence: 0
    };
    
    // Identify new patterns from feedback
    const newPatterns = await this._identifyNewPatterns(processedFeedback);
    evolution.newPatterns = newPatterns;
    
    // Modify existing patterns based on feedback
    const modifiedPatterns = await this._modifyExistingPatterns(processedFeedback, behavioralUpdates);
    evolution.modifiedPatterns = modifiedPatterns;
    
    // Remove obsolete patterns
    const removedPatterns = await this._removeObsoletePatterns();
    evolution.removedPatterns = removedPatterns;
    
    // Calculate evolution confidence
    evolution.confidence = this._calculateEvolutionConfidence(evolution);
    
    // Update pattern library
    this._updatePatternLibrary(evolution);
    
    // Record evolution history
    this.evolutionHistory.push({
      timestamp: Date.now(),
      evolution,
      trigger: 'feedback_processing'
    });
    
    return evolution;
  }

  async _identifyNewPatterns(processedFeedback) {
    const newPatterns = [];
    
    // Look for novel behavioral sequences in feedback
    if (processedFeedback.behavioralSequence) {
      const sequence = processedFeedback.behavioralSequence;
      const patternSignature = this._generatePatternSignature(sequence);
      
      if (!this.patternLibrary.has(patternSignature)) {
        newPatterns.push({
          signature: patternSignature,
          sequence,
          confidence: 0.6, // Initial confidence for new patterns
          occurrences: 1,
          threatLevel: processedFeedback.actualThreat ? 0.8 : 0.2
        });
      }
    }
    
    return newPatterns;
  }

  async _modifyExistingPatterns(processedFeedback, behavioralUpdates) {
    const modifiedPatterns = [];
    
    // Update pattern confidence based on feedback
    this.patternLibrary.forEach((pattern, signature) => {
      if (this._isPatternRelevant(pattern, processedFeedback)) {
        const oldConfidence = pattern.confidence;
        
        if (processedFeedback.accurate) {
          pattern.confidence = Math.min(1.0, pattern.confidence + 0.05);
        } else {
          pattern.confidence = Math.max(0.1, pattern.confidence - 0.1);
        }
        
        if (Math.abs(pattern.confidence - oldConfidence) > 0.01) {
          modifiedPatterns.push({
            signature,
            oldConfidence,
            newConfidence: pattern.confidence,
            modification: 'confidence_adjustment'
          });
        }
      }
    });
    
    return modifiedPatterns;
  }

  async _removeObsoletePatterns() {
    const removedPatterns = [];
    const obsoleteThreshold = 0.2;
    
    this.patternLibrary.forEach((pattern, signature) => {
      if (pattern.confidence < obsoleteThreshold) {
        removedPatterns.push({
          signature,
          pattern,
          reason: 'low_confidence'
        });
        this.patternLibrary.delete(signature);
      }
    });
    
    return removedPatterns;
  }

  _generatePatternSignature(sequence) {
    // Generate a unique signature for a behavioral sequence
    return sequence.map(behavior => `${behavior.type}-${behavior.intensity}`).join('|');
  }

  _isPatternRelevant(pattern, processedFeedback) {
    // Check if pattern is relevant to current feedback
    if (!processedFeedback.behavioralSequence) return false;
    
    const feedbackSignature = this._generatePatternSignature(processedFeedback.behavioralSequence);
    return pattern.signature.includes(feedbackSignature) || feedbackSignature.includes(pattern.signature);
  }

  _calculateEvolutionConfidence(evolution) {
    const factors = {
      newPatterns: evolution.newPatterns.length * 0.3,
      modifiedPatterns: evolution.modifiedPatterns.length * 0.2,
      removedPatterns: evolution.removedPatterns.length * 0.1
    };
    
    const totalActivity = Object.values(factors).reduce((sum, val) => sum + val, 0);
    return Math.min(1.0, totalActivity);
  }

  _updatePatternLibrary(evolution) {
    // Add new patterns
    evolution.newPatterns.forEach(pattern => {
      this.patternLibrary.set(pattern.signature, pattern);
    });
    
    // Patterns are already modified in place during _modifyExistingPatterns
    // Obsolete patterns are already removed during _removeObsoletePatterns
  }
}

/**
 * Feedback Processor
 * Processes and validates feedback for learning
 */
class FeedbackProcessor {
  async processFeedback(feedback, assessmentId, contextualData) {
    const processed = {
      assessmentId,
      timestamp: Date.now(),
      accurate: feedback.accurate,
      predictedThreat: feedback.predictedThreat,
      actualThreat: feedback.actualThreat,
      confidence: feedback.confidence || 0.5,
      source: feedback.source || 'unknown',
      reliability: this._assessFeedbackReliability(feedback),
      consistencyScore: await this._calculateConsistencyScore(feedback, contextualData),
      behavioralSequence: feedback.behavioralSequence,
      contextualFactors: this._extractContextualFactors(contextualData)
    };
    
    // Validate feedback quality
    processed.quality = await this._validateFeedbackQuality(processed);
    
    return processed;
  }

  _assessFeedbackReliability(feedback) {
    let reliability = 0.7; // Base reliability
    
    // Adjust based on source
    const sourceReliability = {
      'human_expert': 0.9,
      'automated_system': 0.8,
      'user_report': 0.6,
      'unknown': 0.5
    };
    
    reliability = sourceReliability[feedback.source] || 0.5;
    
    // Adjust based on confidence
    if (feedback.confidence) {
      reliability = (reliability + feedback.confidence) / 2;
    }
    
    return reliability;
  }

  async _calculateConsistencyScore(feedback, contextualData) {
    // Calculate how consistent this feedback is with historical patterns
    // This would involve comparing with similar past cases
    // For now, return a reasonable default
    return 0.75;
  }

  _extractContextualFactors(contextualData) {
    return {
      temporal: contextualData.temporalContext,
      spatial: contextualData.spatialContext,
      environmental: contextualData.environmentalContext,
      historical: contextualData.historicalPatterns
    };
  }

  async _validateFeedbackQuality(processed) {
    const quality = {
      valid: true,
      score: 0,
      issues: []
    };
    
    // Check reliability threshold
    if (processed.reliability < 0.5) {
      quality.issues.push('Low feedback reliability');
      quality.valid = false;
    }
    
    // Check for required fields
    if (processed.accurate === undefined) {
      quality.issues.push('Missing accuracy information');
      quality.valid = false;
    }
    
    // Check consistency
    if (processed.consistencyScore < 0.3) {
      quality.issues.push('Low consistency with historical patterns');
      quality.valid = false;
    }
    
    quality.score = quality.valid ? 1.0 - (quality.issues.length * 0.2) : 0.3;
    
    return quality;
  }
}

/**
 * Environmental Adapter
 * Adapts to environmental changes and conditions
 */
class EnvironmentalAdapter {
  constructor() {
    this.environmentalHistory = [];
    this.adaptationRules = new Map();
  }

  async adaptToEnvironment(processedFeedback, contextualData) {
    const adaptation = {
      environmentalChanges: [],
      adaptationRules: [],
      confidence: 0
    };
    
    // Detect environmental changes
    const changes = await this._detectEnvironmentalChanges(contextualData);
    adaptation.environmentalChanges = changes;
    
    // Generate adaptation rules
    const rules = await this._generateAdaptationRules(changes, processedFeedback);
    adaptation.adaptationRules = rules;
    
    // Calculate adaptation confidence
    adaptation.confidence = this._calculateAdaptationConfidence(changes, rules);
    
    // Update environmental history
    this.environmentalHistory.push({
      timestamp: Date.now(),
      contextualData,
      changes,
      feedback: processedFeedback
    });
    
    // Apply adaptation rules
    await this._applyAdaptationRules(rules);
    
    return adaptation;
  }

  async _detectEnvironmentalChanges(contextualData) {
    const changes = [];
    
    // Compare with recent environmental history
    const recentHistory = this.environmentalHistory.slice(-10);
    
    if (recentHistory.length > 0) {
      const lastContext = recentHistory[recentHistory.length - 1].contextualData;
      
      // Check for temporal pattern changes
      if (this._hasTemporalPatternChanged(contextualData, lastContext)) {
        changes.push({
          type: 'temporal_pattern',
          description: 'Temporal activity patterns have shifted',
          magnitude: 0.3
        });
      }
      
      // Check for spatial pattern changes
      if (this._hasSpatialPatternChanged(contextualData, lastContext)) {
        changes.push({
          type: 'spatial_pattern',
          description: 'Spatial activity patterns have shifted',
          magnitude: 0.25
        });
      }
    }
    
    return changes;
  }

  async _generateAdaptationRules(changes, processedFeedback) {
    const rules = [];
    
    changes.forEach(change => {
      if (change.magnitude > 0.2) {
        rules.push({
          trigger: change.type,
          action: this._determineAdaptationAction(change, processedFeedback),
          confidence: change.magnitude,
          description: `Adapt to ${change.description}`
        });
      }
    });
    
    return rules;
  }

  _determineAdaptationAction(change, processedFeedback) {
    switch (change.type) {
      case 'temporal_pattern':
        return {
          type: 'adjust_temporal_norms',
          parameters: {
            adjustment: processedFeedback.accurate ? 0.1 : -0.1
          }
        };
      case 'spatial_pattern':
        return {
          type: 'adjust_spatial_norms',
          parameters: {
            adjustment: processedFeedback.accurate ? 0.1 : -0.1
          }
        };
      default:
        return {
          type: 'general_adaptation',
          parameters: {
            adjustment: 0.05
          }
        };
    }
  }

  _calculateAdaptationConfidence(changes, rules) {
    if (changes.length === 0) return 0.5;
    
    const avgChangeMagnitude = changes.reduce((sum, change) => sum + change.magnitude, 0) / changes.length;
    const ruleCount = rules.length;
    
    return Math.min(1.0, avgChangeMagnitude + (ruleCount * 0.1));
  }

  async _applyAdaptationRules(rules) {
    rules.forEach(rule => {
      this.adaptationRules.set(rule.trigger, rule);
    });
  }

  _hasTemporalPatternChanged(current, previous) {
    if (!current.temporalContext || !previous.temporalContext) return false;
    
    const currentHour = current.temporalContext.hour;
    const previousHour = previous.temporalContext.hour;
    
    return Math.abs(currentHour - previousHour) > 2;
  }

  _hasSpatialPatternChanged(current, previous) {
    if (!current.spatialContext || !previous.spatialContext) return false;
    
    return current.spatialContext.location !== previous.spatialContext.location;
  }
}

/**
 * Learning State
 * Manages the overall learning state and progress
 */
class LearningState {
  constructor() {
    this.state = {
      learningPhase: 'initialization',
      adaptationCount: 0,
      lastUpdate: Date.now(),
      confidence: 0.5,
      stability: 0.5
    };
  }

  async updateState(processedFeedback, behavioralUpdates, patternUpdates, environmentalUpdates) {
    const previousState = { ...this.state };
    
    // Update adaptation count
    this.state.adaptationCount++;
    
    // Update learning phase
    this.state.learningPhase = this._determineLearningPhase();
    
    // Update confidence based on feedback accuracy
    this._updateConfidence(processedFeedback);
    
    // Update stability based on update magnitudes
    this._updateStability(behavioralUpdates, patternUpdates, environmentalUpdates);
    
    // Update timestamp
    this.state.lastUpdate = Date.now();
    
    return {
      previousState,
      currentState: { ...this.state },
      changes: this._calculateStateChanges(previousState, this.state)
    };
  }

  _determineLearningPhase() {
    if (this.state.adaptationCount < 10) return 'initialization';
    if (this.state.adaptationCount < 50) return 'rapid_learning';
    if (this.state.adaptationCount < 200) return 'stabilization';
    return 'maintenance';
  }

  _updateConfidence(processedFeedback) {
    const adjustment = processedFeedback.accurate ? 0.02 : -0.05;
    this.state.confidence = Math.max(0.1, Math.min(1.0, this.state.confidence + adjustment));
  }

  _updateStability(behavioralUpdates, patternUpdates, environmentalUpdates) {
    const totalChanges = (behavioralUpdates.changes?.length || 0) +
                        (patternUpdates.newPatterns?.length || 0) +
                        (patternUpdates.modifiedPatterns?.length || 0) +
                        (environmentalUpdates.environmentalChanges?.length || 0);
    
    // More changes = less stability
    const stabilityAdjustment = -totalChanges * 0.02;
    this.state.stability = Math.max(0.1, Math.min(1.0, this.state.stability + stabilityAdjustment));
    
    // Gradual stability recovery
    this.state.stability = Math.min(1.0, this.state.stability + 0.01);
  }

  _calculateStateChanges(previous, current) {
    return {
      phaseChange: previous.learningPhase !== current.learningPhase,
      confidenceChange: Math.abs(previous.confidence - current.confidence),
      stabilityChange: Math.abs(previous.stability - current.stability)
    };
  }
}

/**
 * Performance Metrics
 * Tracks learning performance and effectiveness
 */
class PerformanceMetrics {
  constructor() {
    this.metrics = {
      learningEvents: [],
      efficiencyScores: [],
      adaptationDelays: [],
      accuracyTrends: []
    };
  }

  recordLearning(learningResult) {
    this.metrics.learningEvents.push({
      timestamp: learningResult.timestamp,
      efficiency: learningResult.learningEfficiency,
      impact: learningResult.learningImpact.overall,
      processingTime: learningResult.processingTime
    });
    
    this.metrics.efficiencyScores.push(learningResult.learningEfficiency);
    this.metrics.adaptationDelays.push(learningResult.processingTime);
    
    // Keep only recent metrics (last 100 events)
    if (this.metrics.learningEvents.length > 100) {
      this.metrics.learningEvents.shift();
      this.metrics.efficiencyScores.shift();
      this.metrics.adaptationDelays.shift();
    }
  }

  getAverageEfficiency() {
    if (this.metrics.efficiencyScores.length === 0) return 0;
    return this.metrics.efficiencyScores.reduce((sum, score) => sum + score, 0) / this.metrics.efficiencyScores.length;
  }

  getAdaptationTrends() {
    if (this.metrics.adaptationDelays.length === 0) {
      return { averageDelay: 0, trend: 'stable' };
    }
    
    const averageDelay = this.metrics.adaptationDelays.reduce((sum, delay) => sum + delay, 0) / this.metrics.adaptationDelays.length;
    
    // Calculate trend (recent vs older)
    const recent = this.metrics.adaptationDelays.slice(-10);
    const older = this.metrics.adaptationDelays.slice(-20, -10);
    
    if (recent.length < 5 || older.length < 5) {
      return { averageDelay, trend: 'insufficient_data' };
    }
    
    const recentAvg = recent.reduce((sum, delay) => sum + delay, 0) / recent.length;
    const olderAvg = older.reduce((sum, delay) => sum + delay, 0) / older.length;
    
    const trend = recentAvg > olderAvg * 1.1 ? 'slowing' :
                 recentAvg < olderAvg * 0.9 ? 'improving' : 'stable';
    
    return { averageDelay, trend, recentAvg, olderAvg };
  }

  getLearningVelocity() {
    if (this.metrics.learningEvents.length < 2) return 0;
    
    const recent = this.metrics.learningEvents.slice(-10);
    const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
    
    return recent.length / (timeSpan / 1000); // Events per second
  }

  getPerformanceImprovement() {
    if (this.metrics.efficiencyScores.length < 10) {
      return { improvement: 0, trend: 'insufficient_data' };
    }
    
    const early = this.metrics.efficiencyScores.slice(0, 10);
    const recent = this.metrics.efficiencyScores.slice(-10);
    
    const earlyAvg = early.reduce((sum, score) => sum + score, 0) / early.length;
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    
    const improvement = recentAvg - earlyAvg;
    const trend = improvement > 0.1 ? 'improving' :
                 improvement < -0.1 ? 'declining' : 'stable';
    
    return { improvement, trend, earlyAvg, recentAvg };
  }
}

/**
 * Base class for different norm categories
 */
class BaseNorms {
  constructor() {
    this.norms = new Map();
    this.confidence = 0.5;
    this.lastUpdate = Date.now();
  }

  async updateNorms(observations, newData, learningRate) {
    // Override in subclasses
    return { drift: 0, changes: [] };
  }

  getCurrentNorms() {
    return Object.fromEntries(this.norms);
  }

  applyForgetting(forgettingFactor) {
    // Reduce confidence in old norms
    this.confidence *= forgettingFactor;
  }

  getStabilityScore() {
    return this.confidence;
  }
}

/**
 * Behavioral Norms
 * Manages behavioral pattern norms
 */
class BehavioralNorms extends BaseNorms {
  async updateNorms(observations, newData, learningRate) {
    const changes = [];
    let totalDrift = 0;
    
    // Update behavioral baselines
    if (newData.behavioralIndicators) {
      newData.behavioralIndicators.forEach(indicator => {
        const currentNorm = this.norms.get(indicator.type) || 0.5;
        const newValue = indicator.value;
        const drift = Math.abs(newValue - currentNorm);
        
        if (drift > 0.1) {
          const updatedNorm = currentNorm + (newValue - currentNorm) * learningRate;
          this.norms.set(indicator.type, updatedNorm);
          
          changes.push({
            type: indicator.type,
            oldValue: currentNorm,
            newValue: updatedNorm,
            drift
          });
          
          totalDrift += drift;
        }
      });
    }
    
    this.lastUpdate = Date.now();
    
    return {
      drift: totalDrift / Math.max(changes.length, 1),
      changes
    };
  }
}

/**
 * Temporal Norms
 * Manages time-based pattern norms
 */
class TemporalNorms extends BaseNorms {
  async updateNorms(observations, newData, learningRate) {
    const changes = [];
    let totalDrift = 0;
    
    // Update temporal activity patterns
    if (newData.temporalContext) {
      const hour = newData.temporalContext.hour;
      const activityLevel = newData.temporalContext.activityLevel || 0.5;
      
      const currentNorm = this.norms.get(`hour_${hour}`) || 0.5;
      const drift = Math.abs(activityLevel - currentNorm);
      
      if (drift > 0.05) {
        const updatedNorm = currentNorm + (activityLevel - currentNorm) * learningRate;
        this.norms.set(`hour_${hour}`, updatedNorm);
        
        changes.push({
          type: `temporal_hour_${hour}`,
          oldValue: currentNorm,
          newValue: updatedNorm,
          drift
        });
        
        totalDrift += drift;
      }
    }
    
    this.lastUpdate = Date.now();
    
    return {
      drift: totalDrift / Math.max(changes.length, 1),
      changes
    };
  }
}

/**
 * Spatial Norms
 * Manages location-based pattern norms
 */
class SpatialNorms extends BaseNorms {
  async updateNorms(observations, newData, learningRate) {
    const changes = [];
    let totalDrift = 0;
    
    // Update spatial activity patterns
    if (newData.spatialContext) {
      const location = newData.spatialContext.location;
      const activityLevel = newData.spatialContext.activityLevel || 0.5;
      
      const currentNorm = this.norms.get(location) || 0.5;
      const drift = Math.abs(activityLevel - currentNorm);
      
      if (drift > 0.05) {
        const updatedNorm = currentNorm + (activityLevel - currentNorm) * learningRate;
        this.norms.set(location, updatedNorm);
        
        changes.push({
          type: `spatial_${location}`,
          oldValue: currentNorm,
          newValue: updatedNorm,
          drift
        });
        
        totalDrift += drift;
      }
    }
    
    this.lastUpdate = Date.now();
    
    return {
      drift: totalDrift / Math.max(changes.length, 1),
      changes
    };
  }
}

/**
 * Contextual Norms
 * Manages contextual pattern norms
 */
class ContextualNorms extends BaseNorms {
  async updateNorms(observations, newData, learningRate) {
    const changes = [];
    let totalDrift = 0;
    
    // Update contextual patterns
    if (newData.contextualFactors) {
      Object.entries(newData.contextualFactors).forEach(([factor, value]) => {
        const currentNorm = this.norms.get(factor) || 0.5;
        const drift = Math.abs(value - currentNorm);
        
        if (drift > 0.05) {
          const updatedNorm = currentNorm + (value - currentNorm) * learningRate;
          this.norms.set(factor, updatedNorm);
          
          changes.push({
            type: `contextual_${factor}`,
            oldValue: currentNorm,
            newValue: updatedNorm,
            drift
          });
          
          totalDrift += drift;
        }
      });
    }
    
    this.lastUpdate = Date.now();
    
    return {
      drift: totalDrift / Math.max(changes.length, 1),
      changes
    };
  }
}

/**
 * Environmental Norms
 * Manages environmental condition norms
 */
class EnvironmentalNorms extends BaseNorms {
  async updateNorms(observations, newData, learningRate) {
    const changes = [];
    let totalDrift = 0;
    
    // Update environmental condition patterns
    if (newData.environmentalContext) {
      Object.entries(newData.environmentalContext).forEach(([condition, value]) => {
        if (typeof value === 'number') {
          const currentNorm = this.norms.get(condition) || 0.5;
          const drift = Math.abs(value - currentNorm);
          
          if (drift > 0.05) {
            const updatedNorm = currentNorm + (value - currentNorm) * learningRate;
            this.norms.set(condition, updatedNorm);
            
            changes.push({
              type: `environmental_${condition}`,
              oldValue: currentNorm,
              newValue: updatedNorm,
              drift
            });
            
            totalDrift += drift;
          }
        }
      });
    }
    
    this.lastUpdate = Date.now();
    
    return {
      drift: totalDrift / Math.max(changes.length, 1),
      changes
    };
  }
}

export {
  AdaptiveLearningSystem,
  NormUpdater,
  PatternEvolver,
  FeedbackProcessor,
  EnvironmentalAdapter,
  LearningState,
  PerformanceMetrics,
  BehavioralNorms,
  TemporalNorms,
  SpatialNorms,
  ContextualNorms,
  EnvironmentalNorms
};
