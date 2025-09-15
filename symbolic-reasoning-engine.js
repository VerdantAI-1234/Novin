/**
 * Symbolic-Probabilistic Reasoning Engine
 * 
 * The core cognitive reasoning system that transforms perception events
 * into semantic threat assessments using symbolic logic combined with
 * probabilistic inference. This is the "mind" that interprets meaning.
 * 
 * @version 2.0.0
 * @author Goliath Security Systems
 */

class SymbolicReasoningEngine {
  constructor(config) {
    this.config = config;
    
    // Symbolic knowledge base
    this.knowledgeBase = new SymbolicKnowledgeBase();
    
    // Probabilistic inference engine
    this.probabilisticInference = new ProbabilisticInferenceEngine();
    
    // Decision trace for explainability
    this.decisionTraces = new Map();
    
    // Reasoning rules and weights
    this.reasoningRules = this._initializeReasoningRules();
    
    console.log('🧠 Symbolic-Probabilistic Reasoning Engine initialized');
  }

  /**
   * Primary reasoning method - transforms perception + intent into cognitive assessment
   */
  async reason(perceptionEvent, intentAssessment, contextualHistory) {
    const reasoningId = this._generateReasoningId();
    const startTime = performance.now();
    
    try {
      // Initialize decision trace
      const decisionTrace = new DecisionTrace(reasoningId, perceptionEvent);
      
      // Step 1: Symbolic Analysis - Apply logical rules
      const symbolicAnalysis = await this._performSymbolicAnalysis(
        perceptionEvent, 
        intentAssessment, 
        contextualHistory,
        decisionTrace
      );
      
      // Step 2: Probabilistic Inference - Calculate likelihood distributions
      const probabilisticAnalysis = await this._performProbabilisticInference(
        symbolicAnalysis,
        contextualHistory,
        decisionTrace
      );
      
      // Step 3: Uncertainty Quantification
      const uncertaintyAnalysis = this._quantifyUncertainty(
        symbolicAnalysis,
        probabilisticAnalysis,
        decisionTrace
      );
      
      // Step 4: Graduated Suspicion Scoring
      const suspicionAssessment = this._calculateGraduatedSuspicion(
        symbolicAnalysis,
        probabilisticAnalysis,
        uncertaintyAnalysis,
        decisionTrace
      );
      
      // Step 5: Generate Explainable Reasoning
      const reasoning = this._generateExplainableReasoning(
        decisionTrace,
        suspicionAssessment
      );
      
      const processingTime = performance.now() - startTime;
      
      const cognitiveAssessment = {
        eventId: reasoningId,
        suspicionLevel: suspicionAssessment.suspicionLevel,
        threatCategory: suspicionAssessment.threatCategory,
        intentLikelihood: intentAssessment.intentLikelihood,
        contextualRelevance: contextualHistory.contextualRelevance,
        reasoningCertainty: uncertaintyAnalysis.certainty,
        reasoning: reasoning,
        symbolicFactors: symbolicAnalysis.factors,
        probabilisticFactors: probabilisticAnalysis.factors,
        uncertaintyFactors: uncertaintyAnalysis.factors,
        processingTime: processingTime
      };
      
      // Store decision trace for explainability
      this.decisionTraces.set(reasoningId, decisionTrace);
      
      return cognitiveAssessment;
      
    } catch (error) {
      throw new Error(`Reasoning failed: ${error.message}`);
    }
  }

  /**
   * Explain a previous decision with full reasoning chain
   */
  explainDecision(eventId) {
    const trace = this.decisionTraces.get(eventId);
    if (!trace) {
      return { error: 'Decision trace not found' };
    }
    
    return {
      eventId,
      perceptionEvent: trace.perceptionEvent,
      reasoningSteps: trace.steps,
      symbolicRules: trace.appliedRules,
      probabilisticFactors: trace.probabilisticFactors,
      uncertaintyFactors: trace.uncertaintyFactors,
      finalAssessment: trace.finalAssessment,
      confidenceBreakdown: trace.confidenceBreakdown
    };
  }

  // Private reasoning methods

  async _performSymbolicAnalysis(perceptionEvent, intentAssessment, contextualHistory, trace) {
    trace.addStep('symbolic_analysis', 'Applying symbolic reasoning rules');
    
    const factors = new Map();
    
    // Rule 1: Entity Type Analysis
    const entityTypeAnalysis = this._analyzeEntityType(perceptionEvent.entityType, trace);
    factors.set('entityType', entityTypeAnalysis);
    
    // Rule 2: Behavioral Pattern Analysis
    const behaviorAnalysis = this._analyzeBehaviors(perceptionEvent.behaviors, trace);
    factors.set('behaviors', behaviorAnalysis);
    
    // Rule 3: Spatial Context Analysis
    const spatialAnalysis = this._analyzeSpatialContext(
      perceptionEvent.location, 
      perceptionEvent.spatialData, 
      trace
    );
    factors.set('spatial', spatialAnalysis);
    
    // Rule 4: Temporal Context Analysis
    const temporalAnalysis = this._analyzeTemporalContext(
      perceptionEvent.timestamp, 
      contextualHistory, 
      trace
    );
    factors.set('temporal', temporalAnalysis);
    
    // Rule 5: Intent Coherence Analysis
    const intentCoherence = this._analyzeIntentCoherence(
      intentAssessment, 
      perceptionEvent.behaviors, 
      trace
    );
    factors.set('intentCoherence', intentCoherence);
    
    // Rule 6: Contextual Anomaly Detection
    const anomalyAnalysis = this._detectContextualAnomalies(
      perceptionEvent, 
      contextualHistory, 
      trace
    );
    factors.set('anomalies', anomalyAnalysis);
    
    return {
      factors,
      symbolicScore: this._calculateSymbolicScore(factors),
      appliedRules: trace.appliedRules
    };
  }

  async _performProbabilisticInference(symbolicAnalysis, contextualHistory, trace) {
    trace.addStep('probabilistic_inference', 'Calculating probability distributions');
    
    const factors = new Map();
    
    // Bayesian inference for threat probability
    const threatProbability = this.probabilisticInference.calculateThreatProbability(
      symbolicAnalysis.factors,
      contextualHistory
    );
    factors.set('threatProbability', threatProbability);
    
    // Intent likelihood distribution
    const intentDistribution = this.probabilisticInference.calculateIntentDistribution(
      symbolicAnalysis.factors
    );
    factors.set('intentDistribution', intentDistribution);
    
    // Contextual probability weighting
    const contextualWeighting = this.probabilisticInference.calculateContextualWeighting(
      contextualHistory
    );
    factors.set('contextualWeighting', contextualWeighting);
    
    // Temporal probability patterns
    const temporalProbability = this.probabilisticInference.calculateTemporalProbability(
      contextualHistory.temporalContext
    );
    factors.set('temporalProbability', temporalProbability);
    
    return {
      factors,
      overallProbability: this._calculateOverallProbability(factors),
      confidence: this._calculateProbabilisticConfidence(factors)
    };
  }

  _quantifyUncertainty(symbolicAnalysis, probabilisticAnalysis, trace) {
    trace.addStep('uncertainty_quantification', 'Quantifying reasoning uncertainty');
    
    const factors = new Map();
    
    // Symbolic uncertainty - how clear are the rules?
    const symbolicUncertainty = this._calculateSymbolicUncertainty(symbolicAnalysis);
    factors.set('symbolic', symbolicUncertainty);
    
    // Probabilistic uncertainty - how confident are the probabilities?
    const probabilisticUncertainty = this._calculateProbabilisticUncertainty(probabilisticAnalysis);
    factors.set('probabilistic', probabilisticUncertainty);
    
    // Data sufficiency - do we have enough context?
    const dataSufficiency = this._calculateDataSufficiency(symbolicAnalysis, probabilisticAnalysis);
    factors.set('dataSufficiency', dataSufficiency);
    
    // Conflicting evidence - are there contradictions?
    const conflictingEvidence = this._detectConflictingEvidence(symbolicAnalysis, probabilisticAnalysis);
    factors.set('conflictingEvidence', conflictingEvidence);
    
    const overallCertainty = this._calculateOverallCertainty(factors);
    
    return {
      factors,
      certainty: overallCertainty,
      uncertaintyLevel: 1 - overallCertainty
    };
  }

  _calculateGraduatedSuspicion(symbolicAnalysis, probabilisticAnalysis, uncertaintyAnalysis, trace) {
    trace.addStep('suspicion_calculation', 'Calculating graduated suspicion levels');
    
    // Combine symbolic and probabilistic scores with uncertainty weighting
    const baseScore = (
      symbolicAnalysis.symbolicScore * 0.4 +
      probabilisticAnalysis.overallProbability * 0.6
    ) * uncertaintyAnalysis.certainty;
    
    // Apply contextual modifiers
    const contextualModifier = this._calculateContextualModifier(symbolicAnalysis.factors);
    const adjustedScore = baseScore * contextualModifier;
    
    // Determine threat category based on behavioral patterns
    const threatCategory = this._determineThreatCategory(symbolicAnalysis.factors);
    
    // Calculate graduated suspicion level (0.0 to 1.0)
    const suspicionLevel = Math.min(Math.max(adjustedScore, 0), 1);
    
    return {
      suspicionLevel,
      threatCategory,
      baseScore,
      contextualModifier,
      adjustedScore,
      confidenceLevel: this._mapSuspicionToConfidence(suspicionLevel)
    };
  }

  _generateExplainableReasoning(trace, suspicionAssessment) {
    const reasoning = {
      summary: this._generateReasoningSummary(trace, suspicionAssessment),
      keyFactors: this._extractKeyFactors(trace),
      ruleApplications: this._summarizeRuleApplications(trace),
      uncertaintyExplanation: this._explainUncertainty(trace),
      recommendedAction: this._recommendAction(suspicionAssessment)
    };
    
    return reasoning;
  }

  // Symbolic analysis helper methods

  _analyzeEntityType(entityType, trace) {
    const rule = this.reasoningRules.entityTypeRules[entityType] || this.reasoningRules.entityTypeRules.default;
    trace.addRule('entity_type', `Applied entity type rule for ${entityType}`);
    
    return {
      baseRisk: rule.baseRisk,
      contextualFactors: rule.contextualFactors,
      behaviorModifiers: rule.behaviorModifiers
    };
  }

  _analyzeBehaviors(behaviors, trace) {
    const behaviorAnalysis = {
      suspiciousBehaviors: [],
      normalBehaviors: [],
      riskScore: 0
    };
    
    behaviors.forEach(behavior => {
      const behaviorRule = this.reasoningRules.behaviorRules[behavior];
      if (behaviorRule) {
        if (behaviorRule.suspicionLevel > 0.5) {
          behaviorAnalysis.suspiciousBehaviors.push({
            behavior,
            suspicionLevel: behaviorRule.suspicionLevel,
            reasoning: behaviorRule.reasoning
          });
        } else {
          behaviorAnalysis.normalBehaviors.push({
            behavior,
            normalityLevel: 1 - behaviorRule.suspicionLevel
          });
        }
        behaviorAnalysis.riskScore += behaviorRule.suspicionLevel;
        trace.addRule('behavior', `Applied behavior rule for ${behavior}: ${behaviorRule.reasoning}`);
      }
    });
    
    return behaviorAnalysis;
  }

  _analyzeSpatialContext(location, spatialData, trace) {
    const locationRule = this.reasoningRules.locationRules[location] || this.reasoningRules.locationRules.default;
    trace.addRule('spatial', `Applied spatial rule for ${location}`);
    
    return {
      locationRisk: locationRule.riskLevel,
      accessControl: locationRule.accessControl,
      visibility: locationRule.visibility,
      criticalityLevel: locationRule.criticalityLevel
    };
  }

  _analyzeTemporalContext(timestamp, contextualHistory, trace) {
    const hour = new Date(timestamp).getHours();
    const dayOfWeek = new Date(timestamp).getDay();
    
    const temporalRule = this.reasoningRules.temporalRules.getRule(hour, dayOfWeek);
    trace.addRule('temporal', `Applied temporal rule for ${hour}:00 on day ${dayOfWeek}`);
    
    return {
      timeRisk: temporalRule.riskLevel,
      expectedActivity: temporalRule.expectedActivity,
      anomalyThreshold: temporalRule.anomalyThreshold
    };
  }

  _analyzeIntentCoherence(intentAssessment, behaviors, trace) {
    // Check if observed behaviors match predicted intent
    const coherenceScore = this._calculateIntentBehaviorCoherence(intentAssessment, behaviors);
    trace.addRule('intent_coherence', `Intent-behavior coherence: ${coherenceScore.toFixed(2)}`);
    
    return {
      coherenceScore,
      matchingBehaviors: coherenceScore > 0.7 ? 'high' : coherenceScore > 0.4 ? 'medium' : 'low',
      contradictions: coherenceScore < 0.3
    };
  }

  _detectContextualAnomalies(perceptionEvent, contextualHistory, trace) {
    const anomalies = [];
    
    // Check against normal patterns
    if (contextualHistory.normalPatterns) {
      const expectedBehaviors = contextualHistory.normalPatterns.commonBehaviors || new Map();
      
      perceptionEvent.behaviors.forEach(behavior => {
        const frequency = expectedBehaviors.get(behavior) || 0;
        if (frequency < 0.1) { // Rare behavior for this context
          anomalies.push({
            type: 'rare_behavior',
            behavior,
            frequency,
            severity: 'medium'
          });
        }
      });
    }
    
    trace.addRule('anomaly_detection', `Detected ${anomalies.length} contextual anomalies`);
    
    return {
      anomalies,
      anomalyScore: anomalies.length > 0 ? anomalies.reduce((sum, a) => sum + (a.severity === 'high' ? 0.8 : 0.4), 0) / anomalies.length : 0
    };
  }

  // Calculation helper methods

  _calculateSymbolicScore(factors) {
    let score = 0;
    let totalWeight = 0;
    
    for (const [factorType, factorData] of factors) {
      const weight = this.reasoningRules.factorWeights[factorType] || 1;
      const factorScore = this._extractFactorScore(factorData);
      score += factorScore * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? score / totalWeight : 0;
  }

  _extractFactorScore(factorData) {
    if (typeof factorData === 'number') return factorData;
    if (factorData.riskScore !== undefined) return factorData.riskScore;
    if (factorData.suspicionLevel !== undefined) return factorData.suspicionLevel;
    if (factorData.anomalyScore !== undefined) return factorData.anomalyScore;
    return 0.5; // Default neutral score
  }

  _initializeReasoningRules() {
    return {
      entityTypeRules: {
        'adult_male': { baseRisk: 0.3, contextualFactors: ['time', 'location'], behaviorModifiers: ['avoiding_cameras'] },
        'adult_female': { baseRisk: 0.2, contextualFactors: ['time', 'location'], behaviorModifiers: ['avoiding_cameras'] },
        'child': { baseRisk: 0.1, contextualFactors: ['time'], behaviorModifiers: [] },
        'vehicle': { baseRisk: 0.4, contextualFactors: ['location', 'time'], behaviorModifiers: ['speeding', 'circling'] },
        'animal': { baseRisk: 0.05, contextualFactors: [], behaviorModifiers: [] },
        'default': { baseRisk: 0.3, contextualFactors: ['time', 'location'], behaviorModifiers: [] }
      },
      
      behaviorRules: {
        'avoiding_cameras': { suspicionLevel: 0.8, reasoning: 'Deliberate camera avoidance indicates awareness and potential malicious intent' },
        'carrying_bag': { suspicionLevel: 0.4, reasoning: 'Carrying items could indicate tools or stolen goods' },
        'looking_around': { suspicionLevel: 0.6, reasoning: 'Surveillance behavior suggests reconnaissance' },
        'moving_quickly': { suspicionLevel: 0.3, reasoning: 'Rapid movement may indicate urgency or escape' },
        'loitering': { suspicionLevel: 0.7, reasoning: 'Extended presence without clear purpose is suspicious' },
        'approaching_entry': { suspicionLevel: 0.5, reasoning: 'Movement toward entry points requires attention' },
        'normal_walking': { suspicionLevel: 0.1, reasoning: 'Normal pedestrian movement' },
        'talking_on_phone': { suspicionLevel: 0.2, reasoning: 'Normal communication behavior' }
      },
      
      locationRules: {
        'front_door': { riskLevel: 0.6, accessControl: 'high', visibility: 'high', criticalityLevel: 'high' },
        'back_door': { riskLevel: 0.8, accessControl: 'medium', visibility: 'low', criticalityLevel: 'high' },
        'window': { riskLevel: 0.7, accessControl: 'low', visibility: 'medium', criticalityLevel: 'medium' },
        'garage': { riskLevel: 0.5, accessControl: 'medium', visibility: 'medium', criticalityLevel: 'medium' },
        'yard': { riskLevel: 0.3, accessControl: 'low', visibility: 'high', criticalityLevel: 'low' },
        'street': { riskLevel: 0.2, accessControl: 'none', visibility: 'high', criticalityLevel: 'low' },
        'default': { riskLevel: 0.4, accessControl: 'medium', visibility: 'medium', criticalityLevel: 'medium' }
      },
      
      temporalRules: {
        getRule: (hour, dayOfWeek) => {
          if (hour >= 22 || hour <= 5) {
            return { riskLevel: 0.8, expectedActivity: 'minimal', anomalyThreshold: 0.3 };
          } else if (hour >= 6 && hour <= 8) {
            return { riskLevel: 0.3, expectedActivity: 'morning_routine', anomalyThreshold: 0.6 };
          } else if (hour >= 17 && hour <= 21) {
            return { riskLevel: 0.4, expectedActivity: 'evening_activity', anomalyThreshold: 0.5 };
          } else {
            return { riskLevel: 0.5, expectedActivity: 'daytime', anomalyThreshold: 0.4 };
          }
        }
      },
      
      factorWeights: {
        entityType: 1.0,
        behaviors: 1.5,
        spatial: 1.2,
        temporal: 1.0,
        intentCoherence: 1.3,
        anomalies: 1.1
      }
    };
  }

  _generateReasoningId() {
    return `reasoning-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }

  // Additional helper methods for probabilistic inference, uncertainty, etc.
  // ... (implementation continues)
}

/**
 * Probabilistic Inference Engine
 * Handles Bayesian reasoning and probability calculations
 */
class ProbabilisticInferenceEngine {
  constructor() {
    this.priorProbabilities = this._initializePriors();
  }

  calculateThreatProbability(symbolicFactors, contextualHistory) {
    // Bayesian inference implementation
    let prior = this.priorProbabilities.baseThreat;
    
    // Update with evidence
    for (const [factorType, factorData] of symbolicFactors) {
      const likelihood = this._calculateLikelihood(factorType, factorData);
      prior = this._bayesianUpdate(prior, likelihood);
    }
    
    return prior;
  }

  calculateIntentDistribution(symbolicFactors) {
    const intents = ['benign', 'reconnaissance', 'theft', 'vandalism', 'trespassing'];
    const distribution = {};
    
    intents.forEach(intent => {
      distribution[intent] = this._calculateIntentProbability(intent, symbolicFactors);
    });
    
    return distribution;
  }

  calculateContextualWeighting(contextualHistory) {
    const relevance = contextualHistory.contextualRelevance || 0.5;
    const historicalAccuracy = this._calculateHistoricalAccuracy(contextualHistory);
    
    return relevance * historicalAccuracy;
  }

  calculateTemporalProbability(temporalContext) {
    // Calculate probability based on temporal patterns
    return temporalContext.length > 0 ? 0.7 : 0.3;
  }

  _initializePriors() {
    return {
      baseThreat: 0.1, // 10% base threat probability
      intents: {
        benign: 0.7,
        reconnaissance: 0.1,
        theft: 0.1,
        vandalism: 0.05,
        trespassing: 0.05
      }
    };
  }

  _calculateLikelihood(factorType, factorData) {
    // Calculate likelihood of evidence given threat
    const baseScore = this._extractFactorScore(factorData);
    return Math.min(Math.max(baseScore, 0.01), 0.99); // Avoid 0 or 1 probabilities
  }

  _bayesianUpdate(prior, likelihood) {
    // Simple Bayesian update
    const posterior = (likelihood * prior) / ((likelihood * prior) + ((1 - likelihood) * (1 - prior)));
    return posterior;
  }

  _calculateIntentProbability(intent, symbolicFactors) {
    // Calculate probability of specific intent given evidence
    let probability = this.priorProbabilities.intents[intent] || 0.1;
    
    // Update based on symbolic factors
    // Implementation specific to each intent type
    
    return probability;
  }

  _calculateHistoricalAccuracy(contextualHistory) {
    // Calculate how accurate our historical assessments have been
    return 0.8; // Placeholder - would be calculated from feedback
  }

  _extractFactorScore(factorData) {
    if (typeof factorData === 'number') return factorData;
    if (factorData.riskScore !== undefined) return factorData.riskScore;
    if (factorData.suspicionLevel !== undefined) return factorData.suspicionLevel;
    return 0.5;
  }
}

/**
 * Symbolic Knowledge Base
 * Stores and manages symbolic reasoning rules
 */
class SymbolicKnowledgeBase {
  constructor() {
    this.rules = new Map();
    this.facts = new Map();
    this.relationships = new Map();
  }

  addRule(id, condition, conclusion, confidence) {
    this.rules.set(id, { condition, conclusion, confidence });
  }

  addFact(id, fact, confidence) {
    this.facts.set(id, { fact, confidence });
  }

  queryRules(conditions) {
    const applicableRules = [];
    
    for (const [ruleId, rule] of this.rules) {
      if (this._matchesConditions(rule.condition, conditions)) {
        applicableRules.push({ ruleId, rule });
      }
    }
    
    return applicableRules;
  }

  _matchesConditions(ruleCondition, actualConditions) {
    // ruleCondition should be an array of predicate objects
    if (!Array.isArray(ruleCondition)) {
      return false;
    }
    
    // For the rule to match, all predicates must be true (logical AND)
    for (const predicate of ruleCondition) {
      // Each predicate should have: { factor: string, operator: string, value: any }
      if (!predicate || typeof predicate !== 'object') {
        return false;
      }
      
      const { factor, operator, value } = predicate;
      
      // Check if the factor exists in actualConditions
      if (!(factor in actualConditions)) {
        return false;
      }
      
      const actualValue = actualConditions[factor];
      
      // Evaluate based on operator
      switch (operator) {
        case 'equals':
          if (actualValue !== value) {
            return false;
          }
          break;
          
        case 'greaterThan':
          if (actualValue <= value) {
            return false;
          }
          break;
          
        case 'lessThan':
          if (actualValue >= value) {
            return false;
          }
          break;
          
        case 'contains':
          // For when the actual condition is an array or string
          if (!actualValue || typeof actualValue.includes !== 'function') {
            return false;
          }
          if (!actualValue.includes(value)) {
            return false;
          }
          break;
          
        default:
          // Unsupported operator - return false
          return false;
      }
    }
    
    // All predicates evaluated to true
    return true;
  }
}

/**
 * Decision Trace
 * Tracks the reasoning process for explainability
 */
class DecisionTrace {
  constructor(reasoningId, perceptionEvent) {
    this.reasoningId = reasoningId;
    this.perceptionEvent = perceptionEvent;
    this.steps = [];
    this.appliedRules = [];
    this.probabilisticFactors = [];
    this.uncertaintyFactors = [];
    this.finalAssessment = null;
    this.confidenceBreakdown = {};
  }

  addStep(stepType, description, data = {}) {
    this.steps.push({
      timestamp: Date.now(),
      stepType,
      description,
      data
    });
  }

  addRule(ruleType, description) {
    this.appliedRules.push({
      timestamp: Date.now(),
      ruleType,
      description
    });
  }

  setFinalAssessment(assessment) {
    this.finalAssessment = assessment;
  }
}

export { SymbolicReasoningEngine, ProbabilisticInferenceEngine, SymbolicKnowledgeBase, DecisionTrace };