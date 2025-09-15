/**
 * Intent Modeling Framework
 * 
 * A sophisticated behavioral pattern recognition system that models entity intent
 * through multi-layered analysis of actions, context, and historical patterns.
 * This is the "intuition" that understands what someone is trying to do.
 * 
 * @version 2.0.0
 * @author Goliath Security Systems
 */

class IntentModelingFramework {
  constructor(config) {
    this.config = config;
    
    // Intent analysis engines
    this.behavioralAnalyzer = new BehavioralPatternAnalyzer();
    this.contextualIntentEngine = new ContextualIntentEngine();
    this.temporalIntentTracker = new TemporalIntentTracker();
    this.spatialIntentAnalyzer = new SpatialIntentAnalyzer();
    
    // Intent models
    this.intentModels = new IntentModelLibrary();
    this.intentClassifier = new IntentClassifier();
    
    // Intent tracking
    this.activeIntents = new Map(); // entityId -> intent tracking
    this.intentHistory = new Map(); // entityId -> historical intents
    
    // Learning system
    this.intentLearning = new IntentLearningSystem();
    
    console.log('🎯 Intent Modeling Framework initialized');
  }

  /**
   * Analyze entity intent from perception event and context
   */
  async analyzeIntent(perceptionEvent, contextualHistory, spatialContext) {
    const intentId = this._generateIntentId();
    const startTime = performance.now();
    
    try {
      // Step 1: Behavioral Pattern Analysis
      const behavioralAnalysis = await this.behavioralAnalyzer.analyzeBehaviors(
        perceptionEvent.behaviors,
        perceptionEvent.entityType,
        contextualHistory
      );
      
      // Step 2: Contextual Intent Analysis
      const contextualAnalysis = await this.contextualIntentEngine.analyzeContext(
        perceptionEvent,
        contextualHistory,
        spatialContext
      );
      
      // Step 3: Temporal Intent Tracking
      const temporalAnalysis = await this.temporalIntentTracker.trackTemporalIntent(
        perceptionEvent,
        this._getEntityIntentHistory(perceptionEvent.entityId)
      );
      
      // Step 4: Spatial Intent Analysis
      const spatialAnalysis = await this.spatialIntentAnalyzer.analyzeSpatialIntent(
        perceptionEvent,
        spatialContext
      );
      
      // Step 5: Intent Classification
      const intentClassification = await this.intentClassifier.classifyIntent(
        behavioralAnalysis,
        contextualAnalysis,
        temporalAnalysis,
        spatialAnalysis
      );
      
      // Step 6: Intent Confidence Assessment
      const confidenceAssessment = this._assessIntentConfidence(
        behavioralAnalysis,
        contextualAnalysis,
        temporalAnalysis,
        spatialAnalysis,
        intentClassification
      );
      
      // Step 7: Intent Progression Analysis
      const progressionAnalysis = this._analyzeIntentProgression(
        perceptionEvent.entityId,
        intentClassification,
        temporalAnalysis
      );
      
      const processingTime = performance.now() - startTime;
      
      const intentAssessment = {
        intentId,
        entityId: perceptionEvent.entityId,
        primaryIntent: intentClassification.primaryIntent,
        secondaryIntents: intentClassification.secondaryIntents,
        intentLikelihood: intentClassification.likelihood,
        intentConfidence: confidenceAssessment.confidence,
        intentProgression: progressionAnalysis,
        behavioralIndicators: behavioralAnalysis.indicators,
        contextualFactors: contextualAnalysis.factors,
        temporalPatterns: temporalAnalysis.patterns,
        spatialIndicators: spatialAnalysis.indicators,
        riskAssessment: this._assessIntentRisk(intentClassification),
        processingTime
      };
      
      // Update intent tracking
      this._updateIntentTracking(perceptionEvent.entityId, intentAssessment);
      
      return intentAssessment;
      
    } catch (error) {
      throw new Error(`Intent analysis failed: ${error.message}`);
    }
  }

  /**
   * Get current intent status for an entity
   */
  getEntityIntentStatus(entityId) {
    const activeIntent = this.activeIntents.get(entityId);
    const intentHistory = this.intentHistory.get(entityId) || [];
    
    return {
      entityId,
      currentIntent: activeIntent,
      intentHistory: intentHistory.slice(-10), // Last 10 intents
      intentEvolution: this._analyzeIntentEvolution(intentHistory),
      riskTrend: this._calculateRiskTrend(intentHistory)
    };
  }

  /**
   * Learn from feedback to improve intent modeling
   */
  async learnFromFeedback(intentId, actualOutcome, feedback) {
    await this.intentLearning.learnFromOutcome(intentId, actualOutcome, feedback);
    
    // Update intent models based on learning
    await this._updateIntentModels(feedback);
  }

  /**
   * Get intent modeling insights and statistics
   */
  getIntentInsights() {
    return {
      activeIntents: this.activeIntents.size,
      totalEntitiesTracked: this.intentHistory.size,
      intentDistribution: this._calculateIntentDistribution(),
      accuracyMetrics: this.intentLearning.getAccuracyMetrics(),
      behavioralInsights: this.behavioralAnalyzer.getInsights(),
      modelPerformance: this.intentClassifier.getPerformanceMetrics()
    };
  }

  // Private methods

  _getEntityIntentHistory(entityId) {
    return this.intentHistory.get(entityId) || [];
  }

  _updateIntentTracking(entityId, intentAssessment) {
    // Update active intent
    this.activeIntents.set(entityId, {
      ...intentAssessment,
      lastUpdated: Date.now()
    });
    
    // Add to intent history
    if (!this.intentHistory.has(entityId)) {
      this.intentHistory.set(entityId, []);
    }
    
    this.intentHistory.get(entityId).push({
      timestamp: Date.now(),
      intentAssessment
    });
    
    // Limit history size
    const history = this.intentHistory.get(entityId);
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
  }

  _assessIntentConfidence(behavioralAnalysis, contextualAnalysis, temporalAnalysis, spatialAnalysis, intentClassification) {
    const factors = {
      behavioral: behavioralAnalysis.confidence || 0.5,
      contextual: contextualAnalysis.confidence || 0.5,
      temporal: temporalAnalysis.confidence || 0.5,
      spatial: spatialAnalysis.confidence || 0.5,
      classification: intentClassification.confidence || 0.5
    };
    
    const weights = {
      behavioral: 0.3,
      contextual: 0.25,
      temporal: 0.2,
      spatial: 0.15,
      classification: 0.1
    };
    
    const overallConfidence = Object.keys(factors).reduce((sum, key) => {
      return sum + (factors[key] * weights[key]);
    }, 0);
    
    return {
      confidence: overallConfidence,
      factors,
      weights,
      reliability: this._calculateReliability(factors)
    };
  }

  _analyzeIntentProgression(entityId, intentClassification, temporalAnalysis) {
    const history = this._getEntityIntentHistory(entityId);
    
    if (history.length === 0) {
      return {
        stage: 'initial',
        progression: 'new_entity',
        escalation: false,
        consistency: 1.0
      };
    }
    
    const recentIntents = history.slice(-5).map(h => h.intentAssessment.primaryIntent);
    const currentIntent = intentClassification.primaryIntent;
    
    return {
      stage: this._determineIntentStage(recentIntents, currentIntent),
      progression: this._analyzeProgression(recentIntents, currentIntent),
      escalation: this._detectEscalation(recentIntents, currentIntent),
      consistency: this._calculateIntentConsistency(recentIntents, currentIntent)
    };
  }

  _assessIntentRisk(intentClassification) {
    const riskLevels = {
      'benign': 0.1,
      'curious': 0.2,
      'lost': 0.15,
      'delivery': 0.1,
      'maintenance': 0.2,
      'reconnaissance': 0.8,
      'casing': 0.9,
      'theft_preparation': 0.95,
      'vandalism_preparation': 0.85,
      'trespassing': 0.7,
      'stalking': 0.9,
      'unknown': 0.5
    };
    
    const primaryRisk = riskLevels[intentClassification.primaryIntent] || 0.5;
    const secondaryRisks = intentClassification.secondaryIntents.map(intent => 
      riskLevels[intent.intent] * intent.likelihood
    );
    
    const combinedRisk = primaryRisk * intentClassification.likelihood + 
      secondaryRisks.reduce((sum, risk) => sum + risk, 0) * 0.3;
    
    return {
      riskLevel: Math.min(combinedRisk, 1.0),
      primaryRisk,
      secondaryRisks,
      riskCategory: this._categorizeRisk(combinedRisk)
    };
  }

  _categorizeRisk(riskLevel) {
    if (riskLevel >= 0.8) return 'high';
    if (riskLevel >= 0.6) return 'medium-high';
    if (riskLevel >= 0.4) return 'medium';
    if (riskLevel >= 0.2) return 'low-medium';
    return 'low';
  }

  _determineIntentStage(recentIntents, currentIntent) {
    if (recentIntents.length === 0) return 'initial';
    if (recentIntents.length < 3) return 'developing';
    
    const consistency = this._calculateIntentConsistency(recentIntents, currentIntent);
    if (consistency > 0.8) return 'established';
    if (consistency > 0.5) return 'evolving';
    return 'unstable';
  }

  _analyzeProgression(recentIntents, currentIntent) {
    if (recentIntents.length === 0) return 'new';
    
    const lastIntent = recentIntents[recentIntents.length - 1];
    if (lastIntent === currentIntent) return 'consistent';
    
    const escalationMap = {
      'benign': ['curious', 'reconnaissance'],
      'curious': ['reconnaissance', 'casing'],
      'reconnaissance': ['casing', 'theft_preparation'],
      'casing': ['theft_preparation', 'trespassing']
    };
    
    if (escalationMap[lastIntent] && escalationMap[lastIntent].includes(currentIntent)) {
      return 'escalating';
    }
    
    return 'changing';
  }

  _detectEscalation(recentIntents, currentIntent) {
    const threatLevels = {
      'benign': 1,
      'curious': 2,
      'lost': 1,
      'delivery': 1,
      'maintenance': 2,
      'reconnaissance': 6,
      'casing': 7,
      'theft_preparation': 9,
      'vandalism_preparation': 8,
      'trespassing': 5,
      'stalking': 8
    };
    
    if (recentIntents.length === 0) return false;
    
    const currentThreatLevel = threatLevels[currentIntent] || 5;
    const previousThreatLevel = threatLevels[recentIntents[recentIntents.length - 1]] || 5;
    
    return currentThreatLevel > previousThreatLevel + 1;
  }

  _calculateIntentConsistency(recentIntents, currentIntent) {
    if (recentIntents.length === 0) return 1.0;
    
    const matchingIntents = recentIntents.filter(intent => intent === currentIntent).length;
    return matchingIntents / recentIntents.length;
  }

  _calculateReliability(factors) {
    const values = Object.values(factors);
    if (values.length === 0) return 0.5; // Neutral score for empty factors
    
    const variance = values.reduce((sum, value, _, array) => {
      const mean = array.reduce((a, b) => a + b) / array.length;
      return sum + Math.pow(value - mean, 2);
    }, 0) / values.length;
    
    return Math.max(0, 1 - variance); // Lower variance = higher reliability
  }

  _analyzeIntentEvolution(intentHistory) {
    if (intentHistory.length < 2) return { trend: 'insufficient_data' };
    
    const intents = intentHistory.map(h => h.intentAssessment.primaryIntent);
    const riskLevels = intentHistory.map(h => h.intentAssessment.riskAssessment.riskLevel);
    
    return {
      trend: this._calculateTrend(riskLevels),
      volatility: this._calculateVolatility(intents),
      dominantIntent: this._findDominantIntent(intents),
      evolutionPattern: this._identifyEvolutionPattern(intents)
    };
  }

  _calculateRiskTrend(intentHistory) {
    if (intentHistory.length < 2) return 'stable';
    
    const riskLevels = intentHistory.slice(-5).map(h => h.intentAssessment.riskAssessment.riskLevel);
    const trend = this._calculateTrend(riskLevels);
    
    if (trend > 0.1) return 'increasing';
    if (trend < -0.1) return 'decreasing';
    return 'stable';
  }

  _calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + (i * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  _calculateVolatility(intents) {
    if (intents.length < 2) return 0;
    
    const changes = intents.slice(1).map((intent, i) => intent !== intents[i] ? 1 : 0);
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  }

  _findDominantIntent(intents) {
    const intentCounts = {};
    intents.forEach(intent => {
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });
    
    return Object.keys(intentCounts).reduce((a, b) => 
      intentCounts[a] > intentCounts[b] ? a : b
    );
  }

  _identifyEvolutionPattern(intents) {
    if (intents.length < 3) return 'insufficient_data';
    
    const uniqueIntents = new Set(intents);
    if (uniqueIntents.size === 1) return 'consistent';
    if (uniqueIntents.size === intents.length) return 'highly_variable';
    
    // Check for escalation pattern
    const escalationSequences = [
      ['benign', 'curious', 'reconnaissance'],
      ['curious', 'reconnaissance', 'casing'],
      ['reconnaissance', 'casing', 'theft_preparation']
    ];
    
    for (const sequence of escalationSequences) {
      if (this._containsSequence(intents, sequence)) {
        return 'escalating';
      }
    }
    
    return 'variable';
  }

  _containsSequence(array, sequence) {
    for (let i = 0; i <= array.length - sequence.length; i++) {
      if (sequence.every((item, j) => array[i + j] === item)) {
        return true;
      }
    }
    return false;
  }

  _calculateIntentDistribution() {
    const distribution = {};
    
    for (const activeIntent of this.activeIntents.values()) {
      const intent = activeIntent.primaryIntent;
      distribution[intent] = (distribution[intent] || 0) + 1;
    }
    
    return distribution;
  }

  _generateIntentId() {
    return `intent-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  async _updateIntentModels(feedback) {
    // Update intent models based on feedback
    await this.intentModels.updateFromFeedback(feedback);
  }
}

/**
 * Behavioral Pattern Analyzer
 * Analyzes behavior sequences to infer intent
 */
class BehavioralPatternAnalyzer {
  constructor() {
    this.behaviorPatterns = this._initializeBehaviorPatterns();
    this.sequenceAnalyzer = new BehaviorSequenceAnalyzer();
    this.insights = {
      totalAnalyses: 0,
      patternMatches: 0,
      confidenceDistribution: []
    };
  }

  async analyzeBehaviors(behaviors, entityType, contextualHistory) {
    this.insights.totalAnalyses++;
    
    // Analyze individual behaviors
    const individualAnalysis = this._analyzeIndividualBehaviors(behaviors, entityType);
    
    // Analyze behavior sequences
    const sequenceAnalysis = await this.sequenceAnalyzer.analyzeSequence(behaviors, contextualHistory);
    
    // Analyze behavior context
    const contextAnalysis = this._analyzeContextualBehaviors(behaviors, contextualHistory);
    
    // Calculate overall behavioral indicators
    const indicators = this._calculateBehavioralIndicators(
      individualAnalysis,
      sequenceAnalysis,
      contextAnalysis
    );
    
    const confidence = this._calculateBehavioralConfidence(indicators);
    this.insights.confidenceDistribution.push(confidence);
    
    return {
      indicators,
      individualAnalysis,
      sequenceAnalysis,
      contextAnalysis,
      confidence,
      suspiciousPatterns: this._identifySuspiciousPatterns(indicators),
      normalPatterns: this._identifyNormalPatterns(indicators)
    };
  }

  getInsights() {
    return this.insights;
  }

  _analyzeIndividualBehaviors(behaviors, entityType) {
    const analysis = {
      intentIndicators: new Map(),
      riskFactors: [],
      normalityFactors: []
    };
    
    behaviors.forEach(behavior => {
      const pattern = this.behaviorPatterns.individual[behavior];
      if (pattern) {
        // Add intent indicators
        pattern.intentIndicators.forEach(indicator => {
          const current = analysis.intentIndicators.get(indicator.intent) || 0;
          analysis.intentIndicators.set(indicator.intent, current + indicator.weight);
        });
        
        // Add risk factors
        if (pattern.riskLevel > 0.5) {
          analysis.riskFactors.push({
            behavior,
            riskLevel: pattern.riskLevel,
            reasoning: pattern.reasoning
          });
        } else {
          analysis.normalityFactors.push({
            behavior,
            normalityLevel: 1 - pattern.riskLevel,
            reasoning: pattern.reasoning
          });
        }
      }
    });
    
    return analysis;
  }

  _calculateBehavioralIndicators(individualAnalysis, sequenceAnalysis, contextAnalysis) {
    const indicators = {
      intentStrength: new Map(),
      behavioralRisk: 0,
      patternMatches: [],
      anomalies: []
    };
    
    // Combine intent indicators from all analyses
    for (const [intent, weight] of individualAnalysis.intentIndicators) {
      indicators.intentStrength.set(intent, weight);
    }
    
    // Add sequence-based indicators
    if (sequenceAnalysis.intentIndicators) {
      for (const [intent, weight] of sequenceAnalysis.intentIndicators) {
        const current = indicators.intentStrength.get(intent) || 0;
        indicators.intentStrength.set(intent, current + weight);
      }
    }
    
    // Calculate behavioral risk
    const riskFactors = individualAnalysis.riskFactors.concat(sequenceAnalysis.riskFactors || []);
    indicators.behavioralRisk = riskFactors.reduce((sum, factor) => sum + factor.riskLevel, 0) / Math.max(riskFactors.length, 1);
    
    // Add pattern matches
    indicators.patternMatches = sequenceAnalysis.patternMatches || [];
    
    // Add anomalies
    indicators.anomalies = contextAnalysis.anomalies || [];
    
    return indicators;
  }

  _calculateBehavioralConfidence(indicators) {
    const factors = {
      intentCoverage: indicators.intentStrength.size > 0 ? 0.8 : 0.2,
      patternMatches: indicators.patternMatches.length > 0 ? 0.9 : 0.3,
      riskConsistency: this._calculateRiskConsistency(indicators.behavioralRisk),
      anomalyClarity: indicators.anomalies.length > 0 ? 0.7 : 0.5
    };
    
    return Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.values(factors).length;
  }

  _calculateRiskConsistency(behavioralRisk) {
    // Higher consistency when risk is clearly high or low
    if (behavioralRisk > 0.7 || behavioralRisk < 0.3) return 0.8;
    return 0.4; // Medium risk is less consistent
  }

  _identifySuspiciousPatterns(indicators) {
    return indicators.patternMatches.filter(pattern => pattern.suspicionLevel > 0.6);
  }

  _identifyNormalPatterns(indicators) {
    return indicators.patternMatches.filter(pattern => pattern.suspicionLevel <= 0.4);
  }

  _initializeBehaviorPatterns() {
    return {
      individual: {
        'avoiding_cameras': {
          intentIndicators: [
            { intent: 'reconnaissance', weight: 0.8 },
            { intent: 'casing', weight: 0.9 },
            { intent: 'theft_preparation', weight: 0.7 }
          ],
          riskLevel: 0.9,
          reasoning: 'Deliberate camera avoidance suggests malicious intent'
        },
        'loitering': {
          intentIndicators: [
            { intent: 'reconnaissance', weight: 0.7 },
            { intent: 'casing', weight: 0.8 },
            { intent: 'stalking', weight: 0.6 }
          ],
          riskLevel: 0.8,
          reasoning: 'Extended presence without clear purpose'
        },
        'looking_around': {
          intentIndicators: [
            { intent: 'reconnaissance', weight: 0.6 },
            { intent: 'curious', weight: 0.4 },
            { intent: 'lost', weight: 0.3 }
          ],
          riskLevel: 0.5,
          reasoning: 'Surveillance behavior or orientation seeking'
        },
        'carrying_tools': {
          intentIndicators: [
            { intent: 'theft_preparation', weight: 0.9 },
            { intent: 'vandalism_preparation', weight: 0.8 },
            { intent: 'maintenance', weight: 0.3 }
          ],
          riskLevel: 0.7,
          reasoning: 'Tools could indicate preparation for illegal activity'
        },
        'normal_walking': {
          intentIndicators: [
            { intent: 'benign', weight: 0.8 },
            { intent: 'delivery', weight: 0.3 }
          ],
          riskLevel: 0.1,
          reasoning: 'Normal pedestrian movement'
        },
        'talking_on_phone': {
          intentIndicators: [
            { intent: 'benign', weight: 0.6 },
            { intent: 'coordination', weight: 0.4 }
          ],
          riskLevel: 0.2,
          reasoning: 'Normal communication or potential coordination'
        }
      }
    };
  }
}

/**
 * Behavior Sequence Analyzer
 * Analyzes sequences of behaviors to identify intent patterns
 */
class BehaviorSequenceAnalyzer {
  constructor() {
    this.sequencePatterns = this._initializeSequencePatterns();
  }

  async analyzeSequence(behaviors, contextualHistory) {
    const sequence = behaviors.join('->');
    
    // Find matching patterns
    const patternMatches = this._findPatternMatches(sequence);
    
    // Analyze sequence progression
    const progression = this._analyzeProgression(behaviors);
    
    // Calculate intent indicators from sequence
    const intentIndicators = this._calculateSequenceIntentIndicators(patternMatches, progression);
    
    return {
      sequence,
      patternMatches,
      progression,
      intentIndicators,
      riskFactors: this._extractRiskFactors(patternMatches),
      confidence: this._calculateSequenceConfidence(patternMatches, progression)
    };
  }

  _findPatternMatches(sequence) {
    const matches = [];
    
    for (const [patternId, pattern] of Object.entries(this.sequencePatterns)) {
      if (this._matchesPattern(sequence, pattern.sequence)) {
        matches.push({
          patternId,
          pattern,
          matchStrength: this._calculateMatchStrength(sequence, pattern.sequence),
          suspicionLevel: pattern.suspicionLevel,
          intentIndicators: pattern.intentIndicators
        });
      }
    }
    
    return matches.sort((a, b) => b.matchStrength - a.matchStrength);
  }

  _matchesPattern(sequence, patternSequence) {
    // Simple pattern matching - could be more sophisticated
    return sequence.includes(patternSequence) || 
           this._fuzzyMatch(sequence, patternSequence);
  }

  _fuzzyMatch(sequence, pattern) {
    const sequenceBehaviors = sequence.split('->');
    const patternBehaviors = pattern.split('->');
    
    // Check if pattern behaviors appear in order (not necessarily consecutive)
    let patternIndex = 0;
    for (const behavior of sequenceBehaviors) {
      if (patternIndex < patternBehaviors.length && behavior === patternBehaviors[patternIndex]) {
        patternIndex++;
      }
    }
    
    return patternIndex === patternBehaviors.length;
  }

  _calculateMatchStrength(sequence, pattern) {
    const sequenceBehaviors = sequence.split('->');
    const patternBehaviors = pattern.split('->');
    
    const matchingBehaviors = patternBehaviors.filter(behavior => 
      sequenceBehaviors.includes(behavior)
    ).length;
    
    return matchingBehaviors / patternBehaviors.length;
  }

  _analyzeProgression(behaviors) {
    const progression = {
      escalation: false,
      consistency: 0,
      complexity: behaviors.length,
      suspicionTrend: 'stable'
    };
    
    // Analyze escalation
    const suspicionLevels = behaviors.map(behavior => this._getBehaviorSuspicion(behavior));
    progression.escalation = this._detectEscalation(suspicionLevels);
    
    // Calculate consistency
    progression.consistency = this._calculateConsistency(behaviors);
    
    // Determine suspicion trend
    progression.suspicionTrend = this._determineSuspicionTrend(suspicionLevels);
    
    return progression;
  }

  _calculateSequenceIntentIndicators(patternMatches, progression) {
    const intentIndicators = new Map();
    
    patternMatches.forEach(match => {
      match.pattern.intentIndicators.forEach(indicator => {
        const weight = indicator.weight * match.matchStrength;
        const current = intentIndicators.get(indicator.intent) || 0;
        intentIndicators.set(indicator.intent, current + weight);
      });
    });
    
    return intentIndicators;
  }

  _extractRiskFactors(patternMatches) {
    return patternMatches
      .filter(match => match.suspicionLevel > 0.5)
      .map(match => ({
        pattern: match.patternId,
        riskLevel: match.suspicionLevel,
        reasoning: match.pattern.reasoning
      }));
  }

  _calculateSequenceConfidence(patternMatches, progression) {
    if (patternMatches.length === 0) return 0.3;
    
    const bestMatch = patternMatches[0];
    const matchQuality = bestMatch.matchStrength;
    const progressionClarity = progression.consistency;
    
    return (matchQuality * 0.7) + (progressionClarity * 0.3);
  }

  _getBehaviorSuspicion(behavior) {
    const suspicionMap = {
      'avoiding_cameras': 0.9,
      'loitering': 0.8,
      'looking_around': 0.5,
      'carrying_tools': 0.7,
      'normal_walking': 0.1,
      'talking_on_phone': 0.2
    };
    return suspicionMap[behavior] || 0.5;
  }

  _detectEscalation(suspicionLevels) {
    if (suspicionLevels.length < 2) return false;
    
    for (let i = 1; i < suspicionLevels.length; i++) {
      if (suspicionLevels[i] > suspicionLevels[i - 1] + 0.2) {
        return true;
      }
    }
    return false;
  }

  _calculateConsistency(behaviors) {
    const uniqueBehaviors = new Set(behaviors);
    return 1 - (uniqueBehaviors.size / behaviors.length);
  }

  _determineSuspicionTrend(suspicionLevels) {
    if (suspicionLevels.length < 2) return 'stable';
    
    const first = suspicionLevels[0];
    const last = suspicionLevels[suspicionLevels.length - 1];
    
    if (last > first + 0.2) return 'increasing';
    if (last < first - 0.2) return 'decreasing';
    return 'stable';
  }

  _initializeSequencePatterns() {
    return {
      'reconnaissance_pattern': {
        sequence: 'looking_around->avoiding_cameras->loitering',
        suspicionLevel: 0.9,
        intentIndicators: [
          { intent: 'reconnaissance', weight: 0.9 },
          { intent: 'casing', weight: 0.7 }
        ],
        reasoning: 'Classic reconnaissance behavior sequence'
      },
      'casing_pattern': {
        sequence: 'loitering->looking_around->avoiding_cameras',
        suspicionLevel: 0.85,
        intentIndicators: [
          { intent: 'casing', weight: 0.9 },
          { intent: 'theft_preparation', weight: 0.6 }
        ],
        reasoning: 'Property casing behavior pattern'
      },
      'normal_delivery': {
        sequence: 'normal_walking->approaching_door->talking_on_phone',
        suspicionLevel: 0.2,
        intentIndicators: [
          { intent: 'delivery', weight: 0.8 },
          { intent: 'benign', weight: 0.6 }
        ],
        reasoning: 'Typical delivery person behavior'
      }
    };
  }
}

/**
 * Contextual Intent Engine
 * Analyzes intent based on environmental and situational context
 */
class ContextualIntentEngine {
  async analyzeContext(perceptionEvent, contextualHistory, spatialContext) {
    const factors = {
      temporal: this._analyzeTemporalContext(perceptionEvent.timestamp),
      spatial: this._analyzeSpatialContext(spatialContext),
      environmental: this._analyzeEnvironmentalContext(perceptionEvent, contextualHistory),
      historical: this._analyzeHistoricalContext(contextualHistory)
    };
    
    const contextualIntent = this._inferContextualIntent(factors);
    const confidence = this._calculateContextualConfidence(factors);
    
    return {
      factors,
      contextualIntent,
      confidence,
      anomalies: this._detectContextualAnomalies(factors, contextualHistory)
    };
  }

  _analyzeTemporalContext(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    
    return {
      hour,
      dayOfWeek,
      timeCategory: this._categorizeTime(hour),
      isBusinessHours: hour >= 9 && hour <= 17 && dayOfWeek >= 1 && dayOfWeek <= 5,
      suspicionModifier: this._getTimeSuspicionModifier(hour, dayOfWeek)
    };
  }

  _analyzeSpatialContext(spatialContext) {
    return {
      location: spatialContext.location,
      zone: spatialContext.zone,
      accessibility: this._assessAccessibility(spatialContext.location),
      visibility: this._assessVisibility(spatialContext.location),
      criticalityLevel: this._assessCriticality(spatialContext.location)
    };
  }

  _analyzeEnvironmentalContext(perceptionEvent, contextualHistory) {
    return {
      weatherConditions: perceptionEvent.environmentalData?.weather || 'unknown',
      lightingConditions: this._assessLighting(perceptionEvent.timestamp),
      crowdLevel: this._assessCrowdLevel(contextualHistory),
      activityLevel: this._assessActivityLevel(contextualHistory)
    };
  }

  _analyzeHistoricalContext(contextualHistory) {
    return {
      recentActivity: contextualHistory.spatialHistory?.length || 0,
      normalPatterns: contextualHistory.normalPatterns,
      anomalyPatterns: contextualHistory.anomalyPatterns,
      contextualRelevance: contextualHistory.contextualRelevance
    };
  }

  _inferContextualIntent(factors) {
    const intentProbabilities = {
      'benign': 0.3,
      'delivery': 0.1,
      'maintenance': 0.05,
      'reconnaissance': 0.1,
      'casing': 0.05,
      'theft_preparation': 0.02,
      'trespassing': 0.08,
      'curious': 0.2,
      'lost': 0.1
    };
    
    // Adjust probabilities based on context
    if (!factors.temporal.isBusinessHours) {
      intentProbabilities.reconnaissance *= 2;
      intentProbabilities.casing *= 2;
      intentProbabilities.delivery *= 0.3;
      intentProbabilities.maintenance *= 0.2;
    }
    
    if (factors.spatial.criticalityLevel === 'high') {
      intentProbabilities.reconnaissance *= 1.5;
      intentProbabilities.casing *= 1.5;
    }
    
    // Normalize probabilities
    const total = Object.values(intentProbabilities).reduce((sum, prob) => sum + prob, 0);
    Object.keys(intentProbabilities).forEach(intent => {
      intentProbabilities[intent] /= total;
    });
    
    return intentProbabilities;
  }

  _calculateContextualConfidence(factors) {
    const confidenceFactors = {
      temporal: factors.temporal.isBusinessHours ? 0.8 : 0.6,
      spatial: factors.spatial.criticalityLevel === 'high' ? 0.9 : 0.7,
      environmental: factors.environmental.activityLevel > 0 ? 0.8 : 0.5,
      historical: factors.historical.contextualRelevance
    };
    
    return Object.values(confidenceFactors).reduce((sum, conf) => sum + conf, 0) / Object.values(confidenceFactors).length;
  }

  _detectContextualAnomalies(factors, contextualHistory) {
    const anomalies = [];
    
    // Time-based anomalies
    if (!factors.temporal.isBusinessHours && factors.spatial.criticalityLevel === 'high') {
      anomalies.push({
        type: 'temporal_spatial',
        description: 'High-risk location access during off-hours',
        severity: 'high'
      });
    }
    
    // Historical anomalies
    if (factors.historical.recentActivity === 0 && factors.spatial.zone === 'entry') {
      anomalies.push({
        type: 'historical_spatial',
        description: 'First-time access to entry point',
        severity: 'medium'
      });
    }
    
    return anomalies;
  }

  // Helper methods
  _categorizeTime(hour) {
    if (hour >= 22 || hour <= 5) return 'night';
    if (hour >= 6 && hour <= 8) return 'morning';
    if (hour >= 9 && hour <= 16) return 'day';
    if (hour >= 17 && hour <= 21) return 'evening';
    return 'unknown';
  }

  _getTimeSuspicionModifier(hour, dayOfWeek) {
    if (hour >= 22 || hour <= 5) return 1.5; // Night hours
    if (dayOfWeek === 0 || dayOfWeek === 6) return 1.2; // Weekends
    return 1.0; // Normal hours
  }

  _assessAccessibility(location) {
    const accessibilityMap = {
      'front_door': 'high',
      'back_door': 'medium',
      'window': 'low',
      'garage': 'medium',
      'yard': 'high',
      'street': 'high'
    };
    return accessibilityMap[location] || 'medium';
  }

  _assessVisibility(location) {
    const visibilityMap = {
      'front_door': 'high',
      'back_door': 'low',
      'window': 'medium',
      'garage': 'medium',
      'yard': 'high',
      'street': 'high'
    };
    return visibilityMap[location] || 'medium';
  }

  _assessCriticality(location) {
    const criticalityMap = {
      'front_door': 'high',
      'back_door': 'high',
      'window': 'medium',
      'garage': 'medium',
      'yard': 'low',
      'street': 'low'
    };
    return criticalityMap[location] || 'medium';
  }

  _assessLighting(timestamp) {
    const hour = new Date(timestamp).getHours();
    if (hour >= 6 && hour <= 18) return 'daylight';
    if (hour >= 19 && hour <= 21) return 'twilight';
    return 'dark';
  }

  _assessCrowdLevel(contextualHistory) {
    const recentActivity = contextualHistory.spatialHistory?.length || 0;
    if (recentActivity > 10) return 'high';
    if (recentActivity > 3) return 'medium';
    return 'low';
  }

  _assessActivityLevel(contextualHistory) {
    return contextualHistory.spatialHistory?.length || 0;
  }
}

/**
 * Temporal Intent Tracker
 * Tracks how intent evolves over time for entities
 */
class TemporalIntentTracker {
  async trackTemporalIntent(perceptionEvent, intentHistory) {
    const patterns = this._analyzeTemporalPatterns(intentHistory);
    const evolution = this._analyzeIntentEvolution(intentHistory);
    const persistence = this._analyzePersistence(intentHistory);
    
    return {
      patterns,
      evolution,
      persistence,
      confidence: this._calculateTemporalConfidence(patterns, evolution, persistence)
    };
  }

  _analyzeTemporalPatterns(intentHistory) {
    if (intentHistory.length === 0) return { pattern: 'new_entity' };
    
    const timeIntervals = this._calculateTimeIntervals(intentHistory);
    const intentSequence = intentHistory.map(h => h.intentAssessment.primaryIntent);
    
    return {
      pattern: this._identifyTemporalPattern(timeIntervals, intentSequence),
      frequency: this._calculateFrequency(timeIntervals),
      regularity: this._calculateRegularity(timeIntervals),
      duration: this._calculateTotalDuration(intentHistory)
    };
  }

  _analyzeIntentEvolution(intentHistory) {
    if (intentHistory.length < 2) return { evolution: 'insufficient_data' };
    
    const intents = intentHistory.map(h => h.intentAssessment.primaryIntent);
    const riskLevels = intentHistory.map(h => h.intentAssessment.riskAssessment?.riskLevel || 0.5);
    
    return {
      evolution: this._classifyEvolution(intents),
      riskTrend: this._calculateRiskTrend(riskLevels),
      stability: this._calculateStability(intents),
      escalationRate: this._calculateEscalationRate(riskLevels)
    };
  }

  _analyzePersistence(intentHistory) {
    if (intentHistory.length === 0) return { persistence: 'new' };
    
    const totalDuration = this._calculateTotalDuration(intentHistory);
    const intentConsistency = this._calculateIntentConsistency(intentHistory);
    
    return {
      persistence: this._classifyPersistence(totalDuration, intentConsistency),
      duration: totalDuration,
      consistency: intentConsistency,
      commitment: this._assessCommitment(intentHistory)
    };
  }

  _calculateTemporalConfidence(patterns, evolution, persistence) {
    const factors = {
      patternClarity: patterns.regularity || 0.5,
      evolutionClarity: evolution.stability || 0.5,
      persistenceClarity: persistence.consistency || 0.5
    };
    
    return Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.values(factors).length;
  }

  // Helper methods for temporal analysis
  _calculateTimeIntervals(intentHistory) {
    if (intentHistory.length < 2) return [];
    
    const intervals = [];
    for (let i = 1; i < intentHistory.length; i++) {
      intervals.push(intentHistory[i].timestamp - intentHistory[i - 1].timestamp);
    }
    return intervals;
  }

  _identifyTemporalPattern(timeIntervals, intentSequence) {
    if (timeIntervals.length === 0) return 'single_occurrence';
    
    const avgInterval = timeIntervals.reduce((sum, interval) => sum + interval, 0) / timeIntervals.length;
    
    if (avgInterval < 60000) return 'rapid_sequence'; // Less than 1 minute
    if (avgInterval < 3600000) return 'active_monitoring'; // Less than 1 hour
    if (avgInterval < 86400000) return 'daily_pattern'; // Less than 1 day
    return 'periodic_visits';
  }

  _calculateFrequency(timeIntervals) {
    if (timeIntervals.length === 0) return 0;
    const avgInterval = timeIntervals.reduce((sum, interval) => sum + interval, 0) / timeIntervals.length;
    return 1 / (avgInterval / 3600000); // Events per hour
  }

  _calculateRegularity(timeIntervals) {
    if (timeIntervals.length < 2) return 1;
    
    const mean = timeIntervals.reduce((sum, interval) => sum + interval, 0) / timeIntervals.length;
    if (mean === 0) return 0; // Prevent division by zero
    
    const variance = timeIntervals.reduce((sum, interval) => sum + Math.pow(interval - mean, 2), 0) / timeIntervals.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(0, 1 - (stdDev / mean)); // Lower variance = higher regularity
  }

  _calculateTotalDuration(intentHistory) {
    if (intentHistory.length === 0) return 0;
    return intentHistory[intentHistory.length - 1].timestamp - intentHistory[0].timestamp;
  }

  _classifyEvolution(intents) {
    const uniqueIntents = new Set(intents);
    if (uniqueIntents.size === 1) return 'consistent';
    if (uniqueIntents.size === intents.length) return 'highly_variable';
    
    // Check for escalation
    const threatLevels = intents.map(intent => this._getIntentThreatLevel(intent));
    if (this._isEscalating(threatLevels)) return 'escalating';
    if (this._isDeescalating(threatLevels)) return 'deescalating';
    
    return 'variable';
  }

  _calculateRiskTrend(riskLevels) {
    if (riskLevels.length < 2) return 'stable';
    
    const firstHalf = riskLevels.slice(0, Math.floor(riskLevels.length / 2));
    const secondHalf = riskLevels.slice(Math.floor(riskLevels.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, risk) => sum + risk, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, risk) => sum + risk, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.1) return 'increasing';
    if (secondAvg < firstAvg - 0.1) return 'decreasing';
    return 'stable';
  }

  _calculateStability(intents) {
    const intentCounts = {};
    intents.forEach(intent => {
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(intentCounts));
    return maxCount / intents.length;
  }

  _calculateEscalationRate(riskLevels) {
    if (riskLevels.length < 2) return 0;
    
    const totalChange = riskLevels[riskLevels.length - 1] - riskLevels[0];
    const timeSpan = riskLevels.length - 1;
    
    return totalChange / timeSpan; // Risk change per time unit
  }

  _calculateIntentConsistency(intentHistory) {
    if (intentHistory.length === 0) return 1;
    
    const intents = intentHistory.map(h => h.intentAssessment.primaryIntent);
    const mostCommonIntent = this._findMostCommonIntent(intents);
    const consistentCount = intents.filter(intent => intent === mostCommonIntent).length;
    
    return consistentCount / intents.length;
  }

  _classifyPersistence(totalDuration, intentConsistency) {
    if (totalDuration < 300000) return 'brief'; // Less than 5 minutes
    if (totalDuration < 3600000) return 'short_term'; // Less than 1 hour
    if (totalDuration < 86400000) return 'extended'; // Less than 1 day
    return 'long_term';
  }

  _assessCommitment(intentHistory) {
    const duration = this._calculateTotalDuration(intentHistory);
    const frequency = intentHistory.length;
    const consistency = this._calculateIntentConsistency(intentHistory);
    
    const commitmentScore = (duration / 3600000) * frequency * consistency; // Hours * frequency * consistency
    
    if (commitmentScore > 10) return 'high';
    if (commitmentScore > 3) return 'medium';
    return 'low';
  }

  _getIntentThreatLevel(intent) {
    const threatLevels = {
      'benign': 1,
      'curious': 2,
      'lost': 1,
      'delivery': 1,
      'maintenance': 2,
      'reconnaissance': 7,
      'casing': 8,
      'theft_preparation': 9,
      'vandalism_preparation': 8,
      'trespassing': 6,
      'stalking': 9
    };
    return threatLevels[intent] || 5;
  }

  _isEscalating(threatLevels) {
    for (let i = 1; i < threatLevels.length; i++) {
      if (threatLevels[i] > threatLevels[i - 1] + 1) {
        return true;
      }
    }
    return false;
  }

  _isDeescalating(threatLevels) {
    for (let i = 1; i < threatLevels.length; i++) {
      if (threatLevels[i] < threatLevels[i - 1] - 1) {
        return true;
      }
    }
    return false;
  }

  _findMostCommonIntent(intents) {
    const intentCounts = {};
    intents.forEach(intent => {
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });
    
    return Object.keys(intentCounts).reduce((a, b) => 
      intentCounts[a] > intentCounts[b] ? a : b
    );
  }
}

/**
 * Spatial Intent Analyzer
 * Analyzes intent based on spatial movement and positioning
 */
class SpatialIntentAnalyzer {
  async analyzeSpatialIntent(perceptionEvent, spatialContext) {
    const movementAnalysis = this._analyzeMovementPatterns(perceptionEvent);
    const positioningAnalysis = this._analyzePositioning(perceptionEvent, spatialContext);
    const accessAnalysis = this._analyzeAccessPatterns(perceptionEvent, spatialContext);
    
    const indicators = this._calculateSpatialIndicators(
      movementAnalysis,
      positioningAnalysis,
      accessAnalysis
    );
    
    return {
      indicators,
      movementAnalysis,
      positioningAnalysis,
      accessAnalysis,
      confidence: this._calculateSpatialConfidence(indicators)
    };
  }

  _analyzeMovementPatterns(perceptionEvent) {
    // Analyze movement characteristics
    return {
      speed: perceptionEvent.movementData?.speed || 'unknown',
      direction: perceptionEvent.movementData?.direction || 'unknown',
      trajectory: perceptionEvent.movementData?.trajectory || 'unknown',
      purposefulness: this._assessMovementPurposefulness(perceptionEvent)
    };
  }

  _analyzePositioning(perceptionEvent, spatialContext) {
    return {
      location: perceptionEvent.location,
      zone: spatialContext.zone,
      strategicValue: this._assessStrategicValue(perceptionEvent.location),
      concealment: this._assessConcealment(perceptionEvent.location),
      vantagePoint: this._assessVantagePoint(perceptionEvent.location)
    };
  }

  _analyzeAccessPatterns(perceptionEvent, spatialContext) {
    return {
      accessType: this._classifyAccessType(perceptionEvent.location),
      entryMethod: this._analyzeEntryMethod(perceptionEvent),
      pathAnalysis: this._analyzeAccessPath(perceptionEvent),
      authorization: this._assessAuthorization(perceptionEvent, spatialContext)
    };
  }

  _calculateSpatialIndicators(movementAnalysis, positioningAnalysis, accessAnalysis) {
    return {
      intentStrength: new Map([
        ['reconnaissance', this._calculateReconnaissanceIndicator(movementAnalysis, positioningAnalysis)],
        ['casing', this._calculateCasingIndicator(positioningAnalysis, accessAnalysis)],
        ['theft_preparation', this._calculateTheftIndicator(accessAnalysis, positioningAnalysis)],
        ['trespassing', this._calculateTrespassingIndicator(accessAnalysis)],
        ['benign', this._calculateBenignIndicator(movementAnalysis, accessAnalysis)]
      ]),
      riskFactors: this._identifyRiskFactors(movementAnalysis, positioningAnalysis, accessAnalysis),
      anomalies: this._identifySpatialAnomalies(movementAnalysis, positioningAnalysis)
    };
  }

  _calculateSpatialConfidence(indicators) {
    const hasStrongIndicators = Array.from(indicators.intentStrength.values()).some(strength => strength > 0.7);
    const hasRiskFactors = indicators.riskFactors.length > 0;
    const hasAnomalies = indicators.anomalies.length > 0;
    
    let confidence = 0.5;
    if (hasStrongIndicators) confidence += 0.3;
    if (hasRiskFactors) confidence += 0.1;
    if (hasAnomalies) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  // Helper methods for spatial analysis
  _assessMovementPurposefulness(perceptionEvent) {
    // Assess how purposeful the movement appears
    const behaviors = perceptionEvent.behaviors || [];
    
    if (behaviors.includes('direct_path')) return 'high';
    if (behaviors.includes('wandering')) return 'low';
    if (behaviors.includes('looking_around')) return 'medium';
    
    return 'unknown';
  }

  _assessStrategicValue(location) {
    const strategicValues = {
      'front_door': 'high',
      'back_door': 'high',
      'window': 'medium',
      'garage': 'medium',
      'yard': 'low',
      'street': 'low'
    };
    return strategicValues[location] || 'medium';
  }

  _assessConcealment(location) {
    const concealmentLevels = {
      'front_door': 'low',
      'back_door': 'high',
      'window': 'medium',
      'garage': 'medium',
      'yard': 'low',
      'street': 'low'
    };
    return concealmentLevels[location] || 'medium';
  }

  _assessVantagePoint(location) {
    const vantageValues = {
      'front_door': 'medium',
      'back_door': 'low',
      'window': 'high',
      'garage': 'low',
      'yard': 'medium',
      'street': 'high'
    };
    return vantageValues[location] || 'medium';
  }

  _classifyAccessType(location) {
    const accessTypes = {
      'front_door': 'primary_entry',
      'back_door': 'secondary_entry',
      'window': 'unauthorized_entry',
      'garage': 'vehicle_entry',
      'yard': 'perimeter_access',
      'street': 'public_access'
    };
    return accessTypes[location] || 'unknown';
  }

  _analyzeEntryMethod(perceptionEvent) {
    const behaviors = perceptionEvent.behaviors || [];
    
    if (behaviors.includes('using_key')) return 'authorized';
    if (behaviors.includes('forcing_entry')) return 'forced';
    if (behaviors.includes('climbing')) return 'climbing';
    return 'walking';
  }

  _analyzeAccessPath(perceptionEvent) {
    return {
      pathType: 'direct', // Could be 'direct', 'circuitous', 'hidden'
      approach: 'frontal', // Could be 'frontal', 'side', 'rear'
      stealth: this._assessStealth(perceptionEvent.behaviors || [])
    };
  }

  _assessAuthorization(perceptionEvent, spatialContext) {
    // Simple authorization assessment
    return {
      likely: false, // Would integrate with access control systems
      confidence: 0.5
    };
  }

  _assessStealth(behaviors) {
    const stealthBehaviors = ['avoiding_cameras', 'hiding', 'crouching'];
    const stealthCount = behaviors.filter(b => stealthBehaviors.includes(b)).length;
    return stealthCount / stealthBehaviors.length;
  }

  // Intent strength calculators
  _calculateReconnaissanceIndicator(movementAnalysis, positioningAnalysis) {
    let strength = 0;
    if (positioningAnalysis.vantagePoint === 'high') strength += 0.4;
    if (movementAnalysis.purposefulness === 'medium') strength += 0.3;
    if (positioningAnalysis.strategicValue === 'high') strength += 0.3;
    return Math.min(strength, 1.0);
  }

  _calculateCasingIndicator(positioningAnalysis, accessAnalysis) {
    let strength = 0;
    if (accessAnalysis.accessType === 'primary_entry') strength += 0.4;
    if (positioningAnalysis.concealment === 'high') strength += 0.3;
    if (accessAnalysis.pathAnalysis.stealth > 0.5) strength += 0.3;
    return Math.min(strength, 1.0);
  }

  _calculateTheftIndicator(accessAnalysis, positioningAnalysis) {
    let strength = 0;
    if (accessAnalysis.entryMethod === 'forced') strength += 0.6;
    if (positioningAnalysis.strategicValue === 'high') strength += 0.2;
    if (accessAnalysis.authorization.likely === false) strength += 0.2;
    return Math.min(strength, 1.0);
  }

  _calculateTrespassingIndicator(accessAnalysis) {
    let strength = 0;
    if (accessAnalysis.authorization.likely === false) strength += 0.5;
    if (accessAnalysis.accessType === 'unauthorized_entry') strength += 0.5;
    return Math.min(strength, 1.0);
  }

  _calculateBenignIndicator(movementAnalysis, accessAnalysis) {
    let strength = 0.5; // Default benign assumption
    if (movementAnalysis.purposefulness === 'high') strength += 0.2;
    if (accessAnalysis.entryMethod === 'authorized') strength += 0.3;
    return Math.min(strength, 1.0);
  }

  _identifyRiskFactors(movementAnalysis, positioningAnalysis, accessAnalysis) {
    const riskFactors = [];
    
    if (positioningAnalysis.concealment === 'high') {
      riskFactors.push({
        factor: 'high_concealment',
        riskLevel: 0.7,
        reasoning: 'Positioned in concealed location'
      });
    }
    
    if (accessAnalysis.entryMethod === 'forced') {
      riskFactors.push({
        factor: 'forced_entry',
        riskLevel: 0.9,
        reasoning: 'Attempting forced entry'
      });
    }
    
    return riskFactors;
  }

  _identifySpatialAnomalies(movementAnalysis, positioningAnalysis) {
    const anomalies = [];
    
    if (movementAnalysis.purposefulness === 'low' && positioningAnalysis.strategicValue === 'high') {
      anomalies.push({
        type: 'movement_position_mismatch',
        description: 'Aimless movement in strategic location',
        severity: 'medium'
      });
    }
    
    return anomalies;
  }
}

/**
 * Intent Model Library
 * Contains pre-defined intent models and patterns
 */
class IntentModelLibrary {
  constructor() {
    this.models = this._initializeIntentModels();
  }

  getModel(intentType) {
    return this.models[intentType];
  }

  updateFromFeedback(feedback) {
    // Update models based on feedback
    console.log('Updating intent models from feedback:', feedback);
  }

  _initializeIntentModels() {
    return {
      'reconnaissance': {
        description: 'Gathering information about the target',
        indicators: ['looking_around', 'avoiding_cameras', 'loitering'],
        riskLevel: 0.8,
        escalationPotential: 0.9
      },
      'casing': {
        description: 'Detailed surveillance for future criminal activity',
        indicators: ['repeated_visits', 'photographing', 'timing_activities'],
        riskLevel: 0.9,
        escalationPotential: 0.95
      },
      'benign': {
        description: 'Normal, non-threatening activity',
        indicators: ['normal_walking', 'direct_path', 'expected_behavior'],
        riskLevel: 0.1,
        escalationPotential: 0.1
      }
    };
  }
}

/**
 * Intent Classifier
 * Classifies intent based on multiple analysis inputs
 */
class IntentClassifier {
  constructor() {
    this.performanceMetrics = {
      totalClassifications: 0,
      accuracyRate: 0.85,
      confidenceDistribution: []
    };
  }

  async classifyIntent(behavioralAnalysis, contextualAnalysis, temporalAnalysis, spatialAnalysis) {
    this.performanceMetrics.totalClassifications++;
    
    // Combine all intent indicators
    const combinedIndicators = this._combineIntentIndicators(
      behavioralAnalysis,
      contextualAnalysis,
      temporalAnalysis,
      spatialAnalysis
    );
    
    // Calculate intent probabilities
    const intentProbabilities = this._calculateIntentProbabilities(combinedIndicators);
    
    // Determine primary and secondary intents
    const classification = this._determineIntentClassification(intentProbabilities);
    
    const confidence = this._calculateClassificationConfidence(combinedIndicators, classification);
    this.performanceMetrics.confidenceDistribution.push(confidence);
    
    return {
      primaryIntent: classification.primary,
      secondaryIntents: classification.secondary,
      likelihood: classification.likelihood,
      confidence,
      reasoning: this._generateClassificationReasoning(combinedIndicators, classification)
    };
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  _combineIntentIndicators(behavioralAnalysis, contextualAnalysis, temporalAnalysis, spatialAnalysis) {
    const combined = new Map();
    
    // Add behavioral indicators
    if (behavioralAnalysis.indicators?.intentStrength) {
      for (const [intent, strength] of behavioralAnalysis.indicators.intentStrength) {
        combined.set(intent, (combined.get(intent) || 0) + strength * 0.4);
      }
    }
    
    // Add contextual indicators
    if (contextualAnalysis.contextualIntent) {
      for (const [intent, probability] of Object.entries(contextualAnalysis.contextualIntent)) {
        combined.set(intent, (combined.get(intent) || 0) + probability * 0.3);
      }
    }
    
    // Add spatial indicators
    if (spatialAnalysis.indicators?.intentStrength) {
      for (const [intent, strength] of spatialAnalysis.indicators.intentStrength) {
        combined.set(intent, (combined.get(intent) || 0) + strength * 0.3);
      }
    }
    
    return combined;
  }

  _calculateIntentProbabilities(combinedIndicators) {
    const total = Array.from(combinedIndicators.values()).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
      return { 'unknown': 1.0 };
    }
    
    const probabilities = {};
    for (const [intent, strength] of combinedIndicators) {
      probabilities[intent] = strength / total;
    }
    
    return probabilities;
  }

  _determineIntentClassification(intentProbabilities) {
    const sortedIntents = Object.entries(intentProbabilities)
      .sort(([,a], [,b]) => b - a);
    
    const primary = sortedIntents[0];
    const secondary = sortedIntents.slice(1, 4).map(([intent, prob]) => ({
      intent,
      likelihood: prob
    }));
    
    return {
      primary: primary[0],
      likelihood: primary[1],
      secondary
    };
  }

  _calculateClassificationConfidence(combinedIndicators, classification) {
    const primaryStrength = combinedIndicators.get(classification.primary) || 0;
    const totalStrength = Array.from(combinedIndicators.values()).reduce((sum, val) => sum + val, 0);
    
    if (totalStrength === 0) return 0.3;
    
    const dominance = primaryStrength / totalStrength;
    const coverage = combinedIndicators.size > 0 ? 0.8 : 0.2;
    
    return (dominance * 0.7) + (coverage * 0.3);
  }

  _generateClassificationReasoning(combinedIndicators, classification) {
    const reasons = [];
    
    const primaryStrength = combinedIndicators.get(classification.primary) || 0;
    reasons.push(`Primary intent '${classification.primary}' has strength ${primaryStrength.toFixed(2)}`);
    
    if (classification.secondary.length > 0) {
      const topSecondary = classification.secondary[0];
      reasons.push(`Secondary intent '${topSecondary.intent}' has likelihood ${topSecondary.likelihood.toFixed(2)}`);
    }
    
    return reasons.join('. ');
  }
}

/**
 * Intent Learning System
 * Learns from feedback to improve intent modeling accuracy
 */
class IntentLearningSystem {
  constructor() {
    this.learningData = {
      outcomes: [],
      accuracyHistory: [],
      modelUpdates: 0
    };
  }

  async learnFromOutcome(intentId, actualOutcome, feedback) {
    this.learningData.outcomes.push({
      intentId,
      actualOutcome,
      feedback,
      timestamp: Date.now()
    });
    
    // Update accuracy metrics
    this._updateAccuracyMetrics(feedback);
    
    // Trigger model updates if needed
    if (this.learningData.outcomes.length % 10 === 0) {
      await this._updateModels();
    }
  }

  getAccuracyMetrics() {
    const recentOutcomes = this.learningData.outcomes.slice(-100);
    const correctPredictions = recentOutcomes.filter(outcome => 
      outcome.feedback.correct === true
    ).length;
    
    return {
      accuracy: recentOutcomes.length > 0 ? correctPredictions / recentOutcomes.length : 0,
      totalOutcomes: this.learningData.outcomes.length,
      recentAccuracy: correctPredictions / Math.max(recentOutcomes.length, 1),
      modelUpdates: this.learningData.modelUpdates
    };
  }

  _updateAccuracyMetrics(feedback) {
    this.learningData.accuracyHistory.push({
      correct: feedback.correct,
      confidence: feedback.confidence,
      timestamp: Date.now()
    });
    
    // Keep only recent history
    if (this.learningData.accuracyHistory.length > 1000) {
      this.learningData.accuracyHistory.splice(0, this.learningData.accuracyHistory.length - 1000);
    }
  }

  async _updateModels() {
    this.learningData.modelUpdates++;
    console.log(`Intent models updated (${this.learningData.modelUpdates} total updates)`);
  }
}

export {
  IntentModelingFramework,
  BehavioralPatternAnalyzer,
  ContextualIntentEngine,
  TemporalIntentTracker,
  SpatialIntentAnalyzer,
  IntentModelLibrary,
  IntentClassifier,
  IntentLearningSystem
};
