/**
 * Explainable Reasoning System
 * 
 * Enterprise-grade explainable AI system that provides traceable decision chains,
 * human-readable explanations, and transparent reasoning for all cognitive assessments.
 * This is the "voice" that explains what the AI is thinking and why.
 * 
 * @version 2.0.0
 * @author Goliath Security Systems
 */

class ExplainableReasoningSystem {
  constructor(config) {
    this.config = config;
    
    // Core reasoning components
    this.decisionTracer = new DecisionTracer();
    this.explanationGenerator = new ExplanationGenerator();
    this.reasoningChainBuilder = new ReasoningChainBuilder();
    this.confidenceExplainer = new ConfidenceExplainer();
    
    // Explanation templates and patterns
    this.explanationTemplates = new ExplanationTemplates();
    this.narrativeBuilder = new NarrativeBuilder();
    
    // Reasoning history and analytics
    this.reasoningHistory = new Map(); // assessmentId -> reasoning chain
    this.explanationMetrics = new ExplanationMetrics();
    
    console.log('🧠 Explainable Reasoning System initialized');
  }

  /**
   * Generate comprehensive explanation for a cognitive assessment
   */
  async explainAssessment(assessment, contextualData, processingTrace) {
    const explanationId = this._generateExplanationId();
    const startTime = performance.now();
    
    try {
      // Step 1: Build decision trace
      const decisionTrace = await this.decisionTracer.traceDecision(
        assessment,
        contextualData,
        processingTrace
      );
      
      // Step 2: Build reasoning chain
      const reasoningChain = await this.reasoningChainBuilder.buildChain(
        assessment,
        decisionTrace,
        contextualData
      );
      
      // Step 3: Generate human-readable explanation
      const explanation = await this.explanationGenerator.generateExplanation(
        assessment,
        reasoningChain,
        contextualData
      );
      
      // Step 4: Explain confidence and uncertainty
      const confidenceExplanation = await this.confidenceExplainer.explainConfidence(
        assessment,
        reasoningChain
      );
      
      // Step 5: Build narrative explanation
      const narrative = await this.narrativeBuilder.buildNarrative(
        assessment,
        reasoningChain,
        explanation,
        confidenceExplanation
      );
      
      // Step 6: Generate alternative scenarios
      const alternatives = await this._generateAlternativeScenarios(
        assessment,
        reasoningChain
      );
      
      const processingTime = performance.now() - startTime;
      
      const comprehensiveExplanation = {
        explanationId,
        assessmentId: assessment.assessmentId,
        timestamp: Date.now(),
        
        // Core explanation components
        decisionTrace,
        reasoningChain,
        explanation,
        confidenceExplanation,
        narrative,
        alternatives,
        
        // Metadata
        processingTime,
        explainabilityScore: this._calculateExplainabilityScore(explanation, reasoningChain),
        traceabilityLevel: this._assessTraceabilityLevel(decisionTrace)
      };
      
      // Store reasoning history
      this.reasoningHistory.set(assessment.assessmentId, comprehensiveExplanation);
      
      // Update metrics
      this.explanationMetrics.recordExplanation(comprehensiveExplanation);
      
      return comprehensiveExplanation;
      
    } catch (error) {
      throw new Error(`Explanation generation failed: ${error.message}`);
    }
  }

  /**
   * Generate focused explanation for specific aspect
   */
  async explainAspect(assessmentId, aspect, detail = 'medium') {
    const reasoningData = this.reasoningHistory.get(assessmentId);
    if (!reasoningData) {
      throw new Error(`No reasoning data found for assessment ${assessmentId}`);
    }
    
    return await this.explanationGenerator.generateAspectExplanation(
      reasoningData,
      aspect,
      detail
    );
  }

  /**
   * Generate comparative explanation between assessments
   */
  async explainComparison(assessmentId1, assessmentId2) {
    const reasoning1 = this.reasoningHistory.get(assessmentId1);
    const reasoning2 = this.reasoningHistory.get(assessmentId2);
    
    if (!reasoning1 || !reasoning2) {
      throw new Error('Missing reasoning data for comparison');
    }
    
    return await this.explanationGenerator.generateComparison(reasoning1, reasoning2);
  }

  /**
   * Get explanation metrics and insights
   */
  getExplanationInsights() {
    return {
      totalExplanations: this.reasoningHistory.size,
      averageExplainabilityScore: this.explanationMetrics.getAverageExplainabilityScore(),
      traceabilityDistribution: this.explanationMetrics.getTraceabilityDistribution(),
      commonReasoningPatterns: this.explanationMetrics.getCommonPatterns(),
      explanationComplexity: this.explanationMetrics.getComplexityMetrics()
    };
  }

  /**
   * Validate explanation quality
   */
  async validateExplanation(explanationId, validationCriteria) {
    const explanation = Array.from(this.reasoningHistory.values())
      .find(exp => exp.explanationId === explanationId);
    
    if (!explanation) {
      throw new Error(`Explanation ${explanationId} not found`);
    }
    
    return await this._validateExplanationQuality(explanation, validationCriteria);
  }

  // Private methods

  _generateAlternativeScenarios(assessment, reasoningChain) {
    const alternatives = [];
    
    // Generate "what if" scenarios
    const keyFactors = reasoningChain.criticalFactors || [];
    
    keyFactors.forEach(factor => {
      if (factor.impact > 0.3) {
        alternatives.push({
          scenario: `What if ${factor.description} was different?`,
          impact: factor.impact,
          likelyOutcome: this._predictAlternativeOutcome(assessment, factor),
          reasoning: `If ${factor.description} had a different value, the assessment would likely change because ${factor.reasoning}`
        });
      }
    });
    
    return alternatives;
  }

  _predictAlternativeOutcome(assessment, factor) {
    // Simple prediction logic - could be more sophisticated
    const currentSuspicion = assessment.suspicionLevel || 0.5;
    const factorImpact = factor.impact * (factor.positive ? -1 : 1);
    const alternativeSuspicion = Math.max(0, Math.min(1, currentSuspicion + factorImpact));
    
    return {
      suspicionLevel: alternativeSuspicion,
      suspicionCategory: this._categorizeSuspicion(alternativeSuspicion),
      confidenceChange: Math.abs(factorImpact) * 0.5
    };
  }

  _categorizeSuspicion(level) {
    if (level >= 0.8) return 'high';
    if (level >= 0.6) return 'medium-high';
    if (level >= 0.4) return 'medium';
    if (level >= 0.2) return 'low-medium';
    return 'low';
  }

  _calculateExplainabilityScore(explanation, reasoningChain) {
    const factors = {
      clarity: explanation.clarity || 0.5,
      completeness: explanation.completeness || 0.5,
      traceability: reasoningChain.traceability || 0.5,
      coherence: explanation.coherence || 0.5
    };
    
    return Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.values(factors).length;
  }

  _assessTraceabilityLevel(decisionTrace) {
    const traceDepth = decisionTrace.steps?.length || 0;
    const evidenceCount = decisionTrace.evidence?.length || 0;
    
    if (traceDepth >= 5 && evidenceCount >= 3) return 'high';
    if (traceDepth >= 3 && evidenceCount >= 2) return 'medium';
    return 'low';
  }

  async _validateExplanationQuality(explanation, criteria) {
    const validation = {
      valid: true,
      score: 0,
      issues: [],
      strengths: []
    };
    
    // Check clarity
    if (criteria.requireClarity && explanation.explanation.clarity < 0.7) {
      validation.issues.push('Explanation lacks clarity');
      validation.valid = false;
    } else if (explanation.explanation.clarity >= 0.8) {
      validation.strengths.push('High clarity explanation');
    }
    
    // Check completeness
    if (criteria.requireCompleteness && explanation.explanation.completeness < 0.7) {
      validation.issues.push('Explanation is incomplete');
      validation.valid = false;
    }
    
    // Check traceability
    if (criteria.requireTraceability && explanation.traceabilityLevel === 'low') {
      validation.issues.push('Low traceability in decision process');
      validation.valid = false;
    }
    
    validation.score = validation.valid ? 1.0 - (validation.issues.length * 0.2) : 0.5;
    
    return validation;
  }

  _generateExplanationId() {
    return `explanation-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }
}

/**
 * Decision Tracer
 * Traces the decision-making process step by step
 */
class DecisionTracer {
  async traceDecision(assessment, contextualData, processingTrace) {
    const trace = {
      traceId: this._generateTraceId(),
      timestamp: Date.now(),
      steps: [],
      evidence: [],
      dataFlow: [],
      criticalDecisionPoints: []
    };
    
    // Trace symbolic reasoning steps
    if (processingTrace.symbolicReasoning) {
      trace.steps.push({
        step: 'symbolic_reasoning',
        description: 'Applied symbolic rules to analyze situation',
        input: processingTrace.symbolicReasoning.input,
        output: processingTrace.symbolicReasoning.output,
        rulesApplied: processingTrace.symbolicReasoning.rulesApplied,
        confidence: processingTrace.symbolicReasoning.confidence
      });
    }
    
    // Trace intent modeling steps
    if (processingTrace.intentModeling) {
      trace.steps.push({
        step: 'intent_modeling',
        description: 'Analyzed behavioral patterns to infer intent',
        input: processingTrace.intentModeling.input,
        output: processingTrace.intentModeling.output,
        patterns: processingTrace.intentModeling.patterns,
        confidence: processingTrace.intentModeling.confidence
      });
    }
    
    // Trace contextual memory usage
    if (processingTrace.contextualMemory) {
      trace.steps.push({
        step: 'contextual_memory',
        description: 'Retrieved and applied contextual history',
        memoryRetrieved: processingTrace.contextualMemory.retrieved,
        relevanceScore: processingTrace.contextualMemory.relevance,
        influence: processingTrace.contextualMemory.influence
      });
    }
    
    // Identify critical decision points
    trace.criticalDecisionPoints = this._identifyCriticalDecisionPoints(trace.steps);
    
    // Build evidence chain
    trace.evidence = this._buildEvidenceChain(assessment, contextualData, trace.steps);
    
    // Map data flow
    trace.dataFlow = this._mapDataFlow(trace.steps);
    
    return trace;
  }

  _identifyCriticalDecisionPoints(steps) {
    return steps
      .filter(step => step.confidence && (step.confidence < 0.6 || step.confidence > 0.9))
      .map(step => ({
        step: step.step,
        description: step.description,
        confidence: step.confidence,
        criticality: step.confidence < 0.6 ? 'uncertainty' : 'high_confidence',
        reasoning: step.confidence < 0.6 ? 
          'Low confidence indicates uncertainty in this decision' :
          'High confidence indicates strong evidence for this decision'
      }));
  }

  _buildEvidenceChain(assessment, contextualData, steps) {
    const evidence = [];
    
    // Add behavioral evidence
    if (assessment.behavioralAnalysis) {
      evidence.push({
        type: 'behavioral',
        description: 'Observed behaviors',
        data: assessment.behavioralAnalysis.indicators,
        strength: assessment.behavioralAnalysis.confidence,
        source: 'behavioral_analysis'
      });
    }
    
    // Add contextual evidence
    if (contextualData.spatialContext) {
      evidence.push({
        type: 'contextual',
        description: 'Spatial and temporal context',
        data: contextualData.spatialContext,
        strength: 0.8,
        source: 'contextual_analysis'
      });
    }
    
    // Add historical evidence
    if (contextualData.historicalPatterns) {
      evidence.push({
        type: 'historical',
        description: 'Historical patterns and norms',
        data: contextualData.historicalPatterns,
        strength: contextualData.historicalPatterns.confidence || 0.6,
        source: 'memory_system'
      });
    }
    
    return evidence;
  }

  _mapDataFlow(steps) {
    const dataFlow = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const nextStep = steps[i + 1];
      
      dataFlow.push({
        from: step.step,
        to: nextStep ? nextStep.step : 'final_assessment',
        data: step.output,
        transformation: nextStep ? 
          `Output from ${step.step} becomes input for ${nextStep.step}` :
          `Output from ${step.step} contributes to final assessment`
      });
    }
    
    return dataFlow;
  }

  _generateTraceId() {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }
}

/**
 * Reasoning Chain Builder
 * Builds logical reasoning chains from decision traces
 */
class ReasoningChainBuilder {
  async buildChain(assessment, decisionTrace, contextualData) {
    const chain = {
      chainId: this._generateChainId(),
      premise: this._establishPremise(assessment, contextualData),
      logicalSteps: [],
      conclusions: [],
      criticalFactors: [],
      assumptions: [],
      uncertainties: [],
      traceability: 0
    };
    
    // Build logical steps from decision trace
    chain.logicalSteps = await this._buildLogicalSteps(decisionTrace, assessment);
    
    // Identify critical factors
    chain.criticalFactors = this._identifyCriticalFactors(decisionTrace, assessment);
    
    // Extract assumptions
    chain.assumptions = this._extractAssumptions(decisionTrace, contextualData);
    
    // Identify uncertainties
    chain.uncertainties = this._identifyUncertainties(decisionTrace, assessment);
    
    // Draw conclusions
    chain.conclusions = this._drawConclusions(chain.logicalSteps, assessment);
    
    // Calculate traceability
    chain.traceability = this._calculateTraceability(chain);
    
    return chain;
  }

  _establishPremise(assessment, contextualData) {
    return {
      situation: `Entity ${assessment.entityId} detected in ${contextualData.location || 'unknown location'}`,
      context: contextualData.temporalContext || 'unknown time',
      initialObservation: assessment.initialObservation || 'Entity presence detected',
      question: 'What is this entity trying to do and what level of concern is warranted?'
    };
  }

  async _buildLogicalSteps(decisionTrace, assessment) {
    const steps = [];
    
    decisionTrace.steps.forEach((traceStep, index) => {
      steps.push({
        stepNumber: index + 1,
        type: traceStep.step,
        premise: this._extractStepPremise(traceStep),
        reasoning: this._extractStepReasoning(traceStep),
        conclusion: this._extractStepConclusion(traceStep),
        confidence: traceStep.confidence || 0.5,
        evidence: this._extractStepEvidence(traceStep)
      });
    });
    
    return steps;
  }

  _extractStepPremise(traceStep) {
    switch (traceStep.step) {
      case 'symbolic_reasoning':
        return 'Given the observed behaviors and context';
      case 'intent_modeling':
        return 'Based on behavioral pattern analysis';
      case 'contextual_memory':
        return 'Considering historical context and norms';
      default:
        return 'Based on available information';
    }
  }

  _extractStepReasoning(traceStep) {
    switch (traceStep.step) {
      case 'symbolic_reasoning':
        return `Applied ${traceStep.rulesApplied?.length || 0} symbolic rules to analyze the situation`;
      case 'intent_modeling':
        return `Analyzed behavioral patterns to infer likely intent: ${traceStep.output?.primaryIntent || 'unknown'}`;
      case 'contextual_memory':
        return `Retrieved contextual history with relevance score ${traceStep.relevanceScore || 'unknown'}`;
      default:
        return traceStep.description || 'Processed available information';
    }
  }

  _extractStepConclusion(traceStep) {
    if (traceStep.output) {
      if (traceStep.output.primaryIntent) {
        return `Primary intent assessed as: ${traceStep.output.primaryIntent}`;
      }
      if (traceStep.output.suspicionLevel) {
        return `Suspicion level determined: ${traceStep.output.suspicionLevel}`;
      }
    }
    return 'Analysis completed for this step';
  }

  _extractStepEvidence(traceStep) {
    const evidence = [];
    
    if (traceStep.input) {
      evidence.push({
        type: 'input_data',
        description: 'Input data for this step',
        data: traceStep.input
      });
    }
    
    if (traceStep.patterns) {
      evidence.push({
        type: 'patterns',
        description: 'Identified patterns',
        data: traceStep.patterns
      });
    }
    
    return evidence;
  }

  _identifyCriticalFactors(decisionTrace, assessment) {
    const factors = [];
    
    // Analyze each step for critical factors
    decisionTrace.steps.forEach(step => {
      if (step.confidence < 0.6) {
        factors.push({
          factor: step.step,
          description: `Low confidence in ${step.step}`,
          impact: 1 - step.confidence,
          reasoning: `This step has low confidence (${step.confidence}), indicating uncertainty`,
          positive: false
        });
      }
      
      if (step.confidence > 0.9) {
        factors.push({
          factor: step.step,
          description: `High confidence in ${step.step}`,
          impact: step.confidence - 0.5,
          reasoning: `This step has high confidence (${step.confidence}), providing strong evidence`,
          positive: true
        });
      }
    });
    
    return factors;
  }

  _extractAssumptions(decisionTrace, contextualData) {
    const assumptions = [];
    
    // Common assumptions in security analysis
    assumptions.push({
      assumption: 'Normal behavior patterns are established',
      basis: 'Historical data and contextual norms',
      confidence: contextualData.normalPatterns?.confidence || 0.7,
      impact: 'Medium - affects baseline for anomaly detection'
    });
    
    assumptions.push({
      assumption: 'Observed behaviors are accurately detected',
      basis: 'Perception system reliability',
      confidence: 0.85,
      impact: 'High - fundamental to all analysis'
    });
    
    return assumptions;
  }

  _identifyUncertainties(decisionTrace, assessment) {
    const uncertainties = [];
    
    // Identify low-confidence steps as uncertainties
    decisionTrace.steps.forEach(step => {
      if (step.confidence < 0.7) {
        uncertainties.push({
          source: step.step,
          description: `Uncertainty in ${step.step} analysis`,
          confidence: step.confidence,
          impact: this._assessUncertaintyImpact(step.confidence),
          mitigation: this._suggestUncertaintyMitigation(step.step)
        });
      }
    });
    
    return uncertainties;
  }

  _assessUncertaintyImpact(confidence) {
    if (confidence < 0.4) return 'high';
    if (confidence < 0.6) return 'medium';
    return 'low';
  }

  _suggestUncertaintyMitigation(stepType) {
    const mitigations = {
      'symbolic_reasoning': 'Gather more behavioral evidence or contextual information',
      'intent_modeling': 'Observe entity for longer period to establish pattern',
      'contextual_memory': 'Build more historical context through continued observation'
    };
    
    return mitigations[stepType] || 'Continue monitoring to reduce uncertainty';
  }

  _drawConclusions(logicalSteps, assessment) {
    const conclusions = [];
    
    // Primary conclusion
    conclusions.push({
      type: 'primary',
      conclusion: `Entity intent assessed as: ${assessment.primaryIntent || 'unknown'}`,
      confidence: assessment.intentConfidence || 0.5,
      basis: 'Combined analysis of behavior, context, and historical patterns'
    });
    
    // Risk conclusion
    if (assessment.riskAssessment) {
      conclusions.push({
        type: 'risk',
        conclusion: `Risk level: ${assessment.riskAssessment.riskCategory || 'unknown'}`,
        confidence: assessment.riskAssessment.confidence || 0.5,
        basis: 'Intent analysis and contextual risk factors'
      });
    }
    
    // Recommendation conclusion
    conclusions.push({
      type: 'recommendation',
      conclusion: this._generateRecommendation(assessment),
      confidence: 0.8,
      basis: 'Overall assessment and risk level'
    });
    
    return conclusions;
  }

  _generateRecommendation(assessment) {
    const suspicion = assessment.suspicionLevel || 0.5;
    
    if (suspicion >= 0.8) {
      return 'Immediate attention recommended - high suspicion level detected';
    } else if (suspicion >= 0.6) {
      return 'Continued monitoring recommended - elevated suspicion level';
    } else if (suspicion >= 0.4) {
      return 'Standard monitoring - moderate suspicion level';
    } else {
      return 'Normal monitoring - low suspicion level';
    }
  }

  _calculateTraceability(chain) {
    const factors = {
      logicalSteps: chain.logicalSteps.length > 0 ? 0.3 : 0,
      evidence: chain.logicalSteps.every(step => step.evidence.length > 0) ? 0.3 : 0.1,
      assumptions: chain.assumptions.length > 0 ? 0.2 : 0,
      uncertainties: chain.uncertainties.length > 0 ? 0.2 : 0.1
    };
    
    return Object.values(factors).reduce((sum, val) => sum + val, 0);
  }

  _generateChainId() {
    return `chain-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }
}

/**
 * Explanation Generator
 * Generates human-readable explanations from reasoning chains
 */
class ExplanationGenerator {
  constructor() {
    this.templates = new ExplanationTemplates();
  }

  async generateExplanation(assessment, reasoningChain, contextualData) {
    const explanation = {
      summary: await this._generateSummary(assessment, reasoningChain),
      detailed: await this._generateDetailedExplanation(assessment, reasoningChain, contextualData),
      keyFactors: this._explainKeyFactors(reasoningChain.criticalFactors),
      reasoning: this._explainReasoning(reasoningChain.logicalSteps),
      uncertainties: this._explainUncertainties(reasoningChain.uncertainties),
      clarity: this._assessClarity(reasoningChain),
      completeness: this._assessCompleteness(reasoningChain),
      coherence: this._assessCoherence(reasoningChain)
    };
    
    return explanation;
  }

  async generateAspectExplanation(reasoningData, aspect, detail) {
    switch (aspect) {
      case 'intent':
        return this._explainIntent(reasoningData, detail);
      case 'confidence':
        return this._explainConfidence(reasoningData, detail);
      case 'risk':
        return this._explainRisk(reasoningData, detail);
      case 'context':
        return this._explainContext(reasoningData, detail);
      default:
        throw new Error(`Unknown aspect: ${aspect}`);
    }
  }

  async generateComparison(reasoning1, reasoning2) {
    return {
      summary: this._compareAssessments(reasoning1, reasoning2),
      intentComparison: this._compareIntents(reasoning1, reasoning2),
      confidenceComparison: this._compareConfidence(reasoning1, reasoning2),
      factorComparison: this._compareFactors(reasoning1, reasoning2)
    };
  }

  // Private explanation methods

  async _generateSummary(assessment, reasoningChain) {
    const intent = assessment.primaryIntent || 'unknown';
    const confidence = Math.round((assessment.intentConfidence || 0.5) * 100);
    const risk = assessment.riskAssessment?.riskCategory || 'unknown';
    
    return `I assess this entity's intent as '${intent}' with ${confidence}% confidence. ` +
           `The risk level is ${risk}. This assessment is based on ${reasoningChain.logicalSteps.length} ` +
           `analytical steps including behavioral analysis, contextual evaluation, and historical comparison.`;
  }

  async _generateDetailedExplanation(assessment, reasoningChain, contextualData) {
    let explanation = `Here's my detailed analysis:\n\n`;
    
    // Explain the situation
    explanation += `**Situation**: ${reasoningChain.premise.situation}\n`;
    explanation += `**Context**: ${reasoningChain.premise.context}\n\n`;
    
    // Explain the reasoning process
    explanation += `**My Reasoning Process**:\n`;
    reasoningChain.logicalSteps.forEach((step, index) => {
      explanation += `${index + 1}. **${step.type.replace('_', ' ').toUpperCase()}**: ${step.reasoning}\n`;
      explanation += `   - Conclusion: ${step.conclusion}\n`;
      explanation += `   - Confidence: ${Math.round(step.confidence * 100)}%\n\n`;
    });
    
    // Explain critical factors
    if (reasoningChain.criticalFactors.length > 0) {
      explanation += `**Critical Factors**:\n`;
      reasoningChain.criticalFactors.forEach(factor => {
        explanation += `- ${factor.description}: ${factor.reasoning}\n`;
      });
      explanation += `\n`;
    }
    
    // Explain final assessment
    explanation += `**Final Assessment**: Based on this analysis, I conclude that the entity's ` +
                  `intent is most likely '${assessment.primaryIntent}' with a risk level of ` +
                  `'${assessment.riskAssessment?.riskCategory}'.`;
    
    return explanation;
  }

  _explainKeyFactors(criticalFactors) {
    if (criticalFactors.length === 0) {
      return 'No critical factors identified in this assessment.';
    }
    
    let explanation = 'The key factors influencing this assessment are:\n\n';
    
    criticalFactors.forEach((factor, index) => {
      explanation += `${index + 1}. **${factor.description}**\n`;
      explanation += `   - Impact: ${factor.impact > 0.7 ? 'High' : factor.impact > 0.4 ? 'Medium' : 'Low'}\n`;
      explanation += `   - Reasoning: ${factor.reasoning}\n\n`;
    });
    
    return explanation;
  }

  _explainReasoning(logicalSteps) {
    let explanation = 'My step-by-step reasoning:\n\n';
    
    logicalSteps.forEach((step, index) => {
      explanation += `**Step ${step.stepNumber}: ${step.type.replace('_', ' ').toUpperCase()}**\n`;
      explanation += `- Premise: ${step.premise}\n`;
      explanation += `- Analysis: ${step.reasoning}\n`;
      explanation += `- Conclusion: ${step.conclusion}\n`;
      explanation += `- Confidence: ${Math.round(step.confidence * 100)}%\n\n`;
    });
    
    return explanation;
  }

  _explainUncertainties(uncertainties) {
    if (uncertainties.length === 0) {
      return 'No significant uncertainties identified in this assessment.';
    }
    
    let explanation = 'Areas of uncertainty in this assessment:\n\n';
    
    uncertainties.forEach((uncertainty, index) => {
      explanation += `${index + 1}. **${uncertainty.description}**\n`;
      explanation += `   - Confidence: ${Math.round(uncertainty.confidence * 100)}%\n`;
      explanation += `   - Impact: ${uncertainty.impact}\n`;
      explanation += `   - Mitigation: ${uncertainty.mitigation}\n\n`;
    });
    
    return explanation;
  }

  // Assessment quality methods
  _assessClarity(reasoningChain) {
    const factors = {
      logicalFlow: reasoningChain.logicalSteps.length > 0 ? 0.4 : 0,
      evidenceClarity: reasoningChain.logicalSteps.every(step => step.evidence.length > 0) ? 0.3 : 0.1,
      conclusionClarity: reasoningChain.conclusions.length > 0 ? 0.3 : 0
    };
    
    return Object.values(factors).reduce((sum, val) => sum + val, 0);
  }

  _assessCompleteness(reasoningChain) {
    const factors = {
      hasSteps: reasoningChain.logicalSteps.length > 0 ? 0.25 : 0,
      hasFactors: reasoningChain.criticalFactors.length > 0 ? 0.25 : 0,
      hasAssumptions: reasoningChain.assumptions.length > 0 ? 0.25 : 0,
      hasConclusions: reasoningChain.conclusions.length > 0 ? 0.25 : 0
    };
    
    return Object.values(factors).reduce((sum, val) => sum + val, 0);
  }

  _assessCoherence(reasoningChain) {
    // Simple coherence assessment - could be more sophisticated
    const stepConfidences = reasoningChain.logicalSteps.map(step => step.confidence);
    const avgConfidence = stepConfidences.reduce((sum, conf) => sum + conf, 0) / stepConfidences.length;
    const confidenceVariance = stepConfidences.reduce((sum, conf) => sum + Math.pow(conf - avgConfidence, 2), 0) / stepConfidences.length;
    
    return Math.max(0, 1 - confidenceVariance); // Lower variance = higher coherence
  }

  // Aspect-specific explanations
  _explainIntent(reasoningData, detail) {
    const assessment = reasoningData.explanation;
    let explanation = `**Intent Analysis**\n\n`;
    
    explanation += `Primary Intent: ${reasoningData.assessmentId}\n`;
    explanation += `Confidence: ${Math.round((assessment.intentConfidence || 0.5) * 100)}%\n\n`;
    
    if (detail === 'high') {
      explanation += `**Detailed Intent Reasoning**:\n`;
      explanation += assessment.detailed || 'Detailed reasoning not available';
    }
    
    return explanation;
  }

  _explainConfidence(reasoningData, detail) {
    const confidence = reasoningData.confidenceExplanation;
    let explanation = `**Confidence Analysis**\n\n`;
    
    explanation += `Overall Confidence: ${Math.round(confidence.overallConfidence * 100)}%\n\n`;
    
    if (detail === 'high') {
      explanation += `**Confidence Factors**:\n`;
      Object.entries(confidence.factors || {}).forEach(([factor, value]) => {
        explanation += `- ${factor}: ${Math.round(value * 100)}%\n`;
      });
    }
    
    return explanation;
  }

  _explainRisk(reasoningData, detail) {
    const risk = reasoningData.riskAssessment;
    let explanation = `**Risk Analysis**\n\n`;
    
    explanation += `Risk Level: ${risk?.riskCategory || 'unknown'}\n`;
    explanation += `Risk Score: ${Math.round((risk?.riskLevel || 0.5) * 100)}%\n\n`;
    
    if (detail === 'high' && risk) {
      explanation += `**Risk Factors**:\n`;
      (risk.riskFactors || []).forEach(factor => {
        explanation += `- ${factor.description}: ${factor.reasoning}\n`;
      });
    }
    
    return explanation;
  }

  _explainContext(reasoningData, detail) {
    let explanation = `**Contextual Analysis**\n\n`;
    
    explanation += `Location: ${reasoningData.contextualData?.location || 'unknown'}\n`;
    explanation += `Time Context: ${reasoningData.contextualData?.temporalContext || 'unknown'}\n\n`;
    
    if (detail === 'high') {
      explanation += `**Contextual Factors**:\n`;
      explanation += `This analysis considers the specific location, time of day, historical patterns, and environmental conditions.`;
    }
    
    return explanation;
  }

  // Comparison methods
  _compareAssessments(reasoning1, reasoning2) {
    return `Comparing two assessments: Assessment 1 shows ${reasoning1.primaryIntent || 'unknown intent'} ` +
           `while Assessment 2 shows ${reasoning2.primaryIntent || 'unknown intent'}. ` +
           `The confidence levels are ${Math.round((reasoning1.intentConfidence || 0.5) * 100)}% and ` +
           `${Math.round((reasoning2.intentConfidence || 0.5) * 100)}% respectively.`;
  }

  _compareIntents(reasoning1, reasoning2) {
    const intent1 = reasoning1.primaryIntent || 'unknown';
    const intent2 = reasoning2.primaryIntent || 'unknown';
    
    if (intent1 === intent2) {
      return `Both assessments identified the same intent: '${intent1}'`;
    } else {
      return `Different intents identified: '${intent1}' vs '${intent2}'`;
    }
  }

  _compareConfidence(reasoning1, reasoning2) {
    const conf1 = Math.round((reasoning1.intentConfidence || 0.5) * 100);
    const conf2 = Math.round((reasoning2.intentConfidence || 0.5) * 100);
    const diff = Math.abs(conf1 - conf2);
    
    return `Confidence levels: ${conf1}% vs ${conf2}% (difference: ${diff}%)`;
  }

  _compareFactors(reasoning1, reasoning2) {
    const factors1 = reasoning1.reasoningChain?.criticalFactors || [];
    const factors2 = reasoning2.reasoningChain?.criticalFactors || [];
    
    return `Critical factors: Assessment 1 has ${factors1.length} factors, Assessment 2 has ${factors2.length} factors`;
  }
}

/**
 * Confidence Explainer
 * Explains confidence levels and uncertainty in assessments
 */
class ConfidenceExplainer {
  async explainConfidence(assessment, reasoningChain) {
    const explanation = {
      overallConfidence: assessment.intentConfidence || 0.5,
      factors: this._analyzeConfidenceFactors(assessment, reasoningChain),
      uncertaintyAnalysis: this._analyzeUncertainty(reasoningChain),
      reliabilityAssessment: this._assessReliability(assessment, reasoningChain),
      confidenceNarrative: this._buildConfidenceNarrative(assessment, reasoningChain)
    };
    
    return explanation;
  }

  _analyzeConfidenceFactors(assessment, reasoningChain) {
    const factors = {};
    
    // Analyze step confidences
    const stepConfidences = reasoningChain.logicalSteps.map(step => step.confidence);
    factors.averageStepConfidence = stepConfidences.reduce((sum, conf) => sum + conf, 0) / stepConfidences.length;
    
    // Evidence quality
    const evidenceCount = reasoningChain.logicalSteps.reduce((sum, step) => sum + step.evidence.length, 0);
    factors.evidenceQuality = Math.min(evidenceCount / 5, 1); // Normalize to 0-1
    
    // Assumption reliability
    const assumptionConfidences = reasoningChain.assumptions.map(assumption => assumption.confidence);
    factors.assumptionReliability = assumptionConfidences.length > 0 ?
      assumptionConfidences.reduce((sum, conf) => sum + conf, 0) / assumptionConfidences.length : 0.5;
    
    // Uncertainty impact
    factors.uncertaintyImpact = 1 - (reasoningChain.uncertainties.length * 0.1);
    
    return factors;
  }

  _analyzeUncertainty(reasoningChain) {
    const uncertainties = reasoningChain.uncertainties;
    
    return {
      totalUncertainties: uncertainties.length,
      highImpactUncertainties: uncertainties.filter(u => u.impact === 'high').length,
      averageUncertaintyConfidence: uncertainties.length > 0 ?
        uncertainties.reduce((sum, u) => sum + u.confidence, 0) / uncertainties.length : 1,
      uncertaintyDistribution: this._categorizeUncertainties(uncertainties)
    };
  }

  _assessReliability(assessment, reasoningChain) {
    const factors = {
      traceability: reasoningChain.traceability,
      evidenceStrength: this._calculateEvidenceStrength(reasoningChain),
      logicalConsistency: this._assessLogicalConsistency(reasoningChain),
      assumptionValidity: this._assessAssumptionValidity(reasoningChain.assumptions)
    };
    
    const overallReliability = Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.values(factors).length;
    
    return {
      overallReliability,
      factors,
      reliabilityCategory: this._categorizeReliability(overallReliability)
    };
  }

  _buildConfidenceNarrative(assessment, reasoningChain) {
    const confidence = Math.round((assessment.intentConfidence || 0.5) * 100);
    const uncertaintyCount = reasoningChain.uncertainties.length;
    
    let narrative = `I have ${confidence}% confidence in this assessment. `;
    
    if (confidence >= 80) {
      narrative += 'This is a high-confidence assessment based on strong evidence and clear patterns.';
    } else if (confidence >= 60) {
      narrative += 'This is a moderate-confidence assessment with good supporting evidence.';
    } else {
      narrative += 'This is a low-confidence assessment with significant uncertainties.';
    }
    
    if (uncertaintyCount > 0) {
      narrative += ` There are ${uncertaintyCount} areas of uncertainty that could affect this assessment.`;
    }
    
    return narrative;
  }

  _categorizeUncertainties(uncertainties) {
    const distribution = { high: 0, medium: 0, low: 0 };
    
    uncertainties.forEach(uncertainty => {
      distribution[uncertainty.impact]++;
    });
    
    return distribution;
  }

  _calculateEvidenceStrength(reasoningChain) {
    const totalEvidence = reasoningChain.logicalSteps.reduce((sum, step) => sum + step.evidence.length, 0);
    return Math.min(totalEvidence / 10, 1); // Normalize to 0-1
  }

  _assessLogicalConsistency(reasoningChain) {
    // Simple consistency check based on confidence variance
    const confidences = reasoningChain.logicalSteps.map(step => step.confidence);
    const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    const variance = confidences.reduce((sum, conf) => sum + Math.pow(conf - avgConfidence, 2), 0) / confidences.length;
    
    return Math.max(0, 1 - variance);
  }

  _assessAssumptionValidity(assumptions) {
    if (assumptions.length === 0) return 0.7; // Default if no assumptions
    
    const avgConfidence = assumptions.reduce((sum, assumption) => sum + assumption.confidence, 0) / assumptions.length;
    return avgConfidence;
  }

  _categorizeReliability(reliability) {
    if (reliability >= 0.8) return 'high';
    if (reliability >= 0.6) return 'medium';
    return 'low';
  }
}

/**
 * Narrative Builder
 * Builds human-like narrative explanations
 */
class NarrativeBuilder {
  async buildNarrative(assessment, reasoningChain, explanation, confidenceExplanation) {
    const narrative = {
      opening: this._buildOpening(assessment, reasoningChain),
      situation: this._describeSituation(reasoningChain.premise),
      analysis: this._narrateAnalysis(reasoningChain.logicalSteps),
      conclusion: this._buildConclusion(assessment, confidenceExplanation),
      recommendation: this._buildRecommendation(assessment),
      fullNarrative: ''
    };
    
    // Combine into full narrative
    narrative.fullNarrative = this._combineNarrative(narrative);
    
    return narrative;
  }

  _buildOpening(assessment, reasoningChain) {
    const entityId = assessment.entityId || 'unknown entity';
    const stepCount = reasoningChain.logicalSteps.length;
    
    return `I've analyzed ${entityId} through ${stepCount} analytical steps. Here's what I observed and concluded:`;
  }

  _describeSituation(premise) {
    return `The situation: ${premise.situation} at ${premise.context}. ${premise.initialObservation}.`;
  }

  _narrateAnalysis(logicalSteps) {
    let narrative = 'My analysis process:\n\n';
    
    logicalSteps.forEach((step, index) => {
      const stepName = step.type.replace('_', ' ');
      const confidence = Math.round(step.confidence * 100);
      
      narrative += `${index + 1}. **${stepName.toUpperCase()}**: ${step.reasoning} `;
      narrative += `I concluded that ${step.conclusion.toLowerCase()} (${confidence}% confidence).\n\n`;
    });
    
    return narrative;
  }

  _buildConclusion(assessment, confidenceExplanation) {
    const intent = assessment.primaryIntent || 'unknown';
    const confidence = Math.round((assessment.intentConfidence || 0.5) * 100);
    const risk = assessment.riskAssessment?.riskCategory || 'unknown';
    
    return `Based on this analysis, I assess the entity's intent as '${intent}' with ${confidence}% confidence. ` +
           `The risk level is ${risk}. ${confidenceExplanation.confidenceNarrative}`;
  }

  _buildRecommendation(assessment) {
    const suspicion = assessment.suspicionLevel || 0.5;
    
    if (suspicion >= 0.8) {
      return 'I recommend immediate attention. The high suspicion level and risk factors warrant prompt investigation.';
    } else if (suspicion >= 0.6) {
      return 'I recommend continued monitoring. The elevated suspicion level suggests this situation should be watched closely.';
    } else if (suspicion >= 0.4) {
      return 'I recommend standard monitoring. The moderate suspicion level is within normal parameters but worth tracking.';
    } else {
      return 'I recommend normal monitoring. The low suspicion level suggests routine activity.';
    }
  }

  _combineNarrative(narrative) {
    return `${narrative.opening}\n\n` +
           `${narrative.situation}\n\n` +
           `${narrative.analysis}` +
           `**CONCLUSION**: ${narrative.conclusion}\n\n` +
           `**RECOMMENDATION**: ${narrative.recommendation}`;
  }
}

/**
 * Explanation Templates
 * Templates for different types of explanations
 */
class ExplanationTemplates {
  constructor() {
    this.templates = this._initializeTemplates();
  }

  getTemplate(type, context) {
    return this.templates[type] || this.templates.default;
  }

  _initializeTemplates() {
    return {
      'high_confidence': {
        opening: 'I have high confidence in this assessment because',
        structure: 'evidence -> reasoning -> conclusion',
        tone: 'assertive'
      },
      'low_confidence': {
        opening: 'I have limited confidence in this assessment due to',
        structure: 'uncertainties -> available_evidence -> tentative_conclusion',
        tone: 'cautious'
      },
      'default': {
        opening: 'Based on my analysis',
        structure: 'situation -> analysis -> conclusion -> recommendation',
        tone: 'neutral'
      }
    };
  }
}

/**
 * Explanation Metrics
 * Tracks and analyzes explanation quality and patterns
 */
class ExplanationMetrics {
  constructor() {
    this.metrics = {
      totalExplanations: 0,
      explainabilityScores: [],
      traceabilityLevels: { high: 0, medium: 0, low: 0 },
      commonPatterns: new Map(),
      complexityScores: []
    };
  }

  recordExplanation(explanation) {
    this.metrics.totalExplanations++;
    this.metrics.explainabilityScores.push(explanation.explainabilityScore);
    this.metrics.traceabilityLevels[explanation.traceabilityLevel]++;
    
    // Record complexity
    const complexity = this._calculateComplexity(explanation);
    this.metrics.complexityScores.push(complexity);
    
    // Record patterns
    this._recordPatterns(explanation);
  }

  getAverageExplainabilityScore() {
    if (this.metrics.explainabilityScores.length === 0) return 0;
    return this.metrics.explainabilityScores.reduce((sum, score) => sum + score, 0) / this.metrics.explainabilityScores.length;
  }

  getTraceabilityDistribution() {
    return this.metrics.traceabilityLevels;
  }

  getCommonPatterns() {
    return Array.from(this.metrics.commonPatterns.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  }

  getComplexityMetrics() {
    if (this.metrics.complexityScores.length === 0) return { average: 0, distribution: {} };
    
    const average = this.metrics.complexityScores.reduce((sum, score) => sum + score, 0) / this.metrics.complexityScores.length;
    const distribution = this._calculateComplexityDistribution();
    
    return { average, distribution };
  }

  _calculateComplexity(explanation) {
    const factors = {
      reasoningSteps: explanation.reasoningChain?.logicalSteps?.length || 0,
      criticalFactors: explanation.reasoningChain?.criticalFactors?.length || 0,
      uncertainties: explanation.reasoningChain?.uncertainties?.length || 0,
      alternatives: explanation.alternatives?.length || 0
    };
    
    return (factors.reasoningSteps * 0.4) + (factors.criticalFactors * 0.3) + 
           (factors.uncertainties * 0.2) + (factors.alternatives * 0.1);
  }

  _recordPatterns(explanation) {
    // Record reasoning patterns
    const steps = explanation.reasoningChain?.logicalSteps || [];
    const pattern = steps.map(step => step.type).join('->');
    
    if (pattern) {
      const current = this.metrics.commonPatterns.get(pattern) || 0;
      this.metrics.commonPatterns.set(pattern, current + 1);
    }
  }

  _calculateComplexityDistribution() {
    const distribution = { low: 0, medium: 0, high: 0 };
    
    this.metrics.complexityScores.forEach(score => {
      if (score < 3) distribution.low++;
      else if (score < 6) distribution.medium++;
      else distribution.high++;
    });
    
    return distribution;
  }
}

export {
  ExplainableReasoningSystem,
  DecisionTracer,
  ReasoningChainBuilder,
  ExplanationGenerator,
  ConfidenceExplainer,
  NarrativeBuilder,
  ExplanationTemplates,
  ExplanationMetrics
};
