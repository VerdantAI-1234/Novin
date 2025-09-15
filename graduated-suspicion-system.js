/**
 * Graduated Suspicion System
 * 
 * Implements graduated suspicion scoring with uncertainty handling, adaptive confidence levels,
 * and nuanced threat assessment. This system moves beyond binary threat detection to provide
 * a spectrum of suspicion levels with explicit uncertainty quantification.
 * 
 * @version 2.0.0
 * @author Goliath Security Systems
 */

class GraduatedSuspicionSystem {
  constructor(config) {
    this.config = config;
    
    // Core suspicion components
    this.suspicionCalculator = new SuspicionCalculator();
    this.uncertaintyHandler = new UncertaintyHandler();
    this.confidenceManager = new ConfidenceManager();
    this.adaptiveScoring = new AdaptiveScoring();
    
    // Suspicion thresholds and categories
    this.suspicionThresholds = {
      minimal: 0.1,
      low: 0.25,
      moderate: 0.4,
      elevated: 0.6,
      high: 0.8,
      critical: 0.95
    };
    
    // Uncertainty tolerance levels
    this.uncertaintyTolerance = {
      strict: 0.1,
      moderate: 0.2,
      permissive: 0.3
    };
    
    // Historical suspicion data for adaptation
    this.suspicionHistory = new Map();
    this.adaptationMetrics = new AdaptationMetrics();
    
    console.log('⚖️ Graduated Suspicion System initialized');
  }

  /**
   * Calculate graduated suspicion score with uncertainty
   */
  async calculateSuspicion(assessment, contextualData, processingTrace) {
    const calculationId = this._generateCalculationId();
    const startTime = performance.now();
    
    try {
      // Step 1: Calculate base suspicion from multiple factors
      const baseSuspicion = await this.suspicionCalculator.calculateBaseSuspicion(
        assessment,
        contextualData,
        processingTrace
      );
      
      // Step 2: Handle uncertainty and adjust suspicion
      const uncertaintyAdjustment = await this.uncertaintyHandler.handleUncertainty(
        baseSuspicion,
        assessment,
        contextualData
      );
      
      // Step 3: Calculate confidence in the suspicion score
      const confidence = await this.confidenceManager.calculateConfidence(
        baseSuspicion,
        uncertaintyAdjustment,
        processingTrace
      );
      
      // Step 4: Apply adaptive scoring based on historical patterns
      const adaptedSuspicion = await this.adaptiveScoring.adaptScore(
        baseSuspicion,
        uncertaintyAdjustment,
        contextualData,
        this.suspicionHistory
      );
      
      // Step 5: Categorize suspicion level
      const suspicionCategory = this._categorizeSuspicion(adaptedSuspicion.finalScore);
      
      // Step 6: Generate suspicion explanation
      const explanation = await this._generateSuspicionExplanation(
        baseSuspicion,
        uncertaintyAdjustment,
        adaptedSuspicion,
        confidence
      );
      
      const processingTime = performance.now() - startTime;
      
      const suspicionAssessment = {
        calculationId,
        assessmentId: assessment.assessmentId,
        timestamp: Date.now(),
        
        // Core suspicion metrics
        baseSuspicion: baseSuspicion.score,
        adjustedSuspicion: adaptedSuspicion.finalScore,
        suspicionCategory,
        confidence: confidence.overallConfidence,
        
        // Uncertainty metrics
        uncertainty: uncertaintyAdjustment.totalUncertainty,
        uncertaintyFactors: uncertaintyAdjustment.factors,
        uncertaintyImpact: uncertaintyAdjustment.impact,
        
        // Detailed breakdown
        factorBreakdown: baseSuspicion.factors,
        adaptationFactors: adaptedSuspicion.adaptationFactors,
        confidenceFactors: confidence.factors,
        
        // Explanation and reasoning
        explanation,
        reasoning: this._buildReasoningChain(baseSuspicion, uncertaintyAdjustment, adaptedSuspicion),
        
        // Recommendations
        recommendations: this._generateRecommendations(adaptedSuspicion.finalScore, confidence.overallConfidence),
        
        // Metadata
        processingTime,
        adaptationLevel: adaptedSuspicion.adaptationLevel,
        reliabilityScore: this._calculateReliabilityScore(confidence, uncertaintyAdjustment)
      };
      
      // Store in history for future adaptation
      this.suspicionHistory.set(assessment.assessmentId, suspicionAssessment);
      
      // Update adaptation metrics
      this.adaptationMetrics.recordSuspicion(suspicionAssessment);
      
      return suspicionAssessment;
      
    } catch (error) {
      throw new Error(`Suspicion calculation failed: ${error.message}`);
    }
  }

  /**
   * Update suspicion based on feedback
   */
  async updateSuspicionWithFeedback(assessmentId, feedback) {
    const suspicionData = this.suspicionHistory.get(assessmentId);
    if (!suspicionData) {
      throw new Error(`No suspicion data found for assessment ${assessmentId}`);
    }
    
    // Update adaptive scoring with feedback
    await this.adaptiveScoring.incorporateFeedback(suspicionData, feedback);
    
    // Update adaptation metrics
    this.adaptationMetrics.recordFeedback(assessmentId, feedback);
    
    return {
      updated: true,
      adaptationImpact: await this.adaptiveScoring.getAdaptationImpact(feedback),
      newThresholds: this.adaptiveScoring.getCurrentThresholds()
    };
  }

  /**
   * Get suspicion trends and patterns
   */
  getSuspicionInsights() {
    return {
      totalAssessments: this.suspicionHistory.size,
      suspicionDistribution: this._calculateSuspicionDistribution(),
      averageConfidence: this.adaptationMetrics.getAverageConfidence(),
      uncertaintyTrends: this.adaptationMetrics.getUncertaintyTrends(),
      adaptationEffectiveness: this.adaptationMetrics.getAdaptationEffectiveness(),
      commonPatterns: this.adaptationMetrics.getCommonPatterns()
    };
  }

  /**
   * Validate suspicion assessment quality
   */
  async validateSuspicionQuality(calculationId, validationCriteria) {
    const suspicionData = Array.from(this.suspicionHistory.values())
      .find(data => data.calculationId === calculationId);
    
    if (!suspicionData) {
      throw new Error(`Suspicion calculation ${calculationId} not found`);
    }
    
    return await this._validateSuspicionQuality(suspicionData, validationCriteria);
  }

  // Private methods

  _categorizeSuspicion(score) {
    const thresholds = this.suspicionThresholds;
    
    if (score >= thresholds.critical) return 'critical';
    if (score >= thresholds.high) return 'high';
    if (score >= thresholds.elevated) return 'elevated';
    if (score >= thresholds.moderate) return 'moderate';
    if (score >= thresholds.low) return 'low';
    if (score >= thresholds.minimal) return 'minimal';
    return 'negligible';
  }

  async _generateSuspicionExplanation(baseSuspicion, uncertaintyAdjustment, adaptedSuspicion, confidence) {
    const explanation = {
      summary: this._generateSummaryExplanation(adaptedSuspicion.finalScore, confidence.overallConfidence),
      factorAnalysis: this._explainFactors(baseSuspicion.factors),
      uncertaintyAnalysis: this._explainUncertainty(uncertaintyAdjustment),
      adaptationAnalysis: this._explainAdaptation(adaptedSuspicion.adaptationFactors),
      confidenceAnalysis: this._explainConfidence(confidence)
    };
    
    return explanation;
  }

  _generateSummaryExplanation(finalScore, confidence) {
    const category = this._categorizeSuspicion(finalScore);
    const scorePercent = Math.round(finalScore * 100);
    const confidencePercent = Math.round(confidence * 100);
    
    return `I assess the suspicion level as ${category} (${scorePercent}%) with ${confidencePercent}% confidence. ` +
           `This assessment considers multiple behavioral, contextual, and historical factors.`;
  }

  _explainFactors(factors) {
    let explanation = 'Key factors contributing to this suspicion level:\n\n';
    
    Object.entries(factors).forEach(([factor, data]) => {
      const impact = data.impact > 0 ? 'increases' : 'decreases';
      const magnitude = Math.abs(data.impact);
      explanation += `- **${factor}**: ${impact} suspicion by ${Math.round(magnitude * 100)}% (${data.reasoning})\n`;
    });
    
    return explanation;
  }

  _explainUncertainty(uncertaintyAdjustment) {
    const totalUncertainty = Math.round(uncertaintyAdjustment.totalUncertainty * 100);
    
    let explanation = `Total uncertainty: ${totalUncertainty}%\n\n`;
    explanation += 'Uncertainty factors:\n';
    
    uncertaintyAdjustment.factors.forEach(factor => {
      explanation += `- ${factor.description}: ${Math.round(factor.uncertainty * 100)}% uncertainty\n`;
    });
    
    return explanation;
  }

  _explainAdaptation(adaptationFactors) {
    if (!adaptationFactors || adaptationFactors.length === 0) {
      return 'No adaptive adjustments applied to this assessment.';
    }
    
    let explanation = 'Adaptive adjustments based on historical patterns:\n\n';
    
    adaptationFactors.forEach(factor => {
      explanation += `- ${factor.description}: ${factor.adjustment > 0 ? 'increased' : 'decreased'} ` +
                    `suspicion by ${Math.round(Math.abs(factor.adjustment) * 100)}%\n`;
    });
    
    return explanation;
  }

  _explainConfidence(confidence) {
    const overallPercent = Math.round(confidence.overallConfidence * 100);
    
    let explanation = `Overall confidence: ${overallPercent}%\n\n`;
    explanation += 'Confidence factors:\n';
    
    Object.entries(confidence.factors).forEach(([factor, value]) => {
      explanation += `- ${factor}: ${Math.round(value * 100)}%\n`;
    });
    
    return explanation;
  }

  _buildReasoningChain(baseSuspicion, uncertaintyAdjustment, adaptedSuspicion) {
    return {
      step1: {
        description: 'Calculate base suspicion from behavioral and contextual factors',
        input: 'Assessment data and contextual information',
        output: `Base suspicion: ${Math.round(baseSuspicion.score * 100)}%`,
        reasoning: 'Analyzed behavioral indicators, contextual anomalies, and environmental factors'
      },
      step2: {
        description: 'Adjust for uncertainty and confidence',
        input: `Base suspicion: ${Math.round(baseSuspicion.score * 100)}%`,
        output: `Uncertainty impact: ${Math.round(uncertaintyAdjustment.impact * 100)}%`,
        reasoning: 'Accounted for data quality, missing information, and analytical limitations'
      },
      step3: {
        description: 'Apply adaptive learning from historical patterns',
        input: 'Uncertainty-adjusted suspicion and historical data',
        output: `Final suspicion: ${Math.round(adaptedSuspicion.finalScore * 100)}%`,
        reasoning: 'Incorporated lessons learned from similar past situations and feedback'
      }
    };
  }

  _generateRecommendations(suspicionScore, confidence) {
    const recommendations = [];
    const category = this._categorizeSuspicion(suspicionScore);
    
    // Primary recommendation based on suspicion level
    switch (category) {
      case 'critical':
        recommendations.push({
          priority: 'immediate',
          action: 'Immediate intervention required',
          reasoning: 'Critical suspicion level indicates high probability of threat'
        });
        break;
      case 'high':
        recommendations.push({
          priority: 'urgent',
          action: 'Escalate to security personnel',
          reasoning: 'High suspicion level warrants immediate attention'
        });
        break;
      case 'elevated':
        recommendations.push({
          priority: 'high',
          action: 'Increase monitoring and prepare response',
          reasoning: 'Elevated suspicion requires enhanced surveillance'
        });
        break;
      case 'moderate':
        recommendations.push({
          priority: 'medium',
          action: 'Continue monitoring with increased attention',
          reasoning: 'Moderate suspicion suggests potential concern'
        });
        break;
      default:
        recommendations.push({
          priority: 'low',
          action: 'Standard monitoring',
          reasoning: 'Low suspicion level indicates normal activity'
        });
    }
    
    // Confidence-based recommendations
    if (confidence < 0.6) {
      recommendations.push({
        priority: 'medium',
        action: 'Gather additional information',
        reasoning: 'Low confidence suggests need for more data'
      });
    }
    
    return recommendations;
  }

  _calculateSuspicionDistribution() {
    const distribution = {
      negligible: 0, minimal: 0, low: 0, moderate: 0,
      elevated: 0, high: 0, critical: 0
    };
    
    this.suspicionHistory.forEach(data => {
      distribution[data.suspicionCategory]++;
    });
    
    return distribution;
  }

  _calculateReliabilityScore(confidence, uncertaintyAdjustment) {
    const confidenceWeight = 0.6;
    const uncertaintyWeight = 0.4;
    
    const confidenceScore = confidence.overallConfidence;
    const uncertaintyScore = 1 - uncertaintyAdjustment.totalUncertainty;
    
    return (confidenceScore * confidenceWeight) + (uncertaintyScore * uncertaintyWeight);
  }

  async _validateSuspicionQuality(suspicionData, criteria) {
    const validation = {
      valid: true,
      score: 0,
      issues: [],
      strengths: []
    };
    
    // Check confidence threshold
    if (criteria.minConfidence && suspicionData.confidence < criteria.minConfidence) {
      validation.issues.push(`Confidence ${Math.round(suspicionData.confidence * 100)}% below required ${Math.round(criteria.minConfidence * 100)}%`);
      validation.valid = false;
    }
    
    // Check uncertainty threshold
    if (criteria.maxUncertainty && suspicionData.uncertainty > criteria.maxUncertainty) {
      validation.issues.push(`Uncertainty ${Math.round(suspicionData.uncertainty * 100)}% above allowed ${Math.round(criteria.maxUncertainty * 100)}%`);
      validation.valid = false;
    }
    
    // Check reliability score
    if (criteria.minReliability && suspicionData.reliabilityScore < criteria.minReliability) {
      validation.issues.push(`Reliability score ${Math.round(suspicionData.reliabilityScore * 100)}% below required ${Math.round(criteria.minReliability * 100)}%`);
      validation.valid = false;
    }
    
    // Identify strengths
    if (suspicionData.confidence >= 0.8) {
      validation.strengths.push('High confidence assessment');
    }
    if (suspicionData.uncertainty <= 0.2) {
      validation.strengths.push('Low uncertainty');
    }
    if (suspicionData.reliabilityScore >= 0.8) {
      validation.strengths.push('High reliability score');
    }
    
    validation.score = validation.valid ? 1.0 - (validation.issues.length * 0.2) : 0.5;
    
    return validation;
  }

  _generateCalculationId() {
    return `suspicion-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  }
}

/**
 * Suspicion Calculator
 * Calculates base suspicion from multiple factors
 */
class SuspicionCalculator {
  async calculateBaseSuspicion(assessment, contextualData, processingTrace) {
    const factors = {};
    let totalScore = 0;
    let totalWeight = 0;
    
    // Behavioral factors
    if (assessment.behavioralAnalysis) {
      const behavioralSuspicion = this._calculateBehavioralSuspicion(assessment.behavioralAnalysis);
      factors.behavioral = behavioralSuspicion;
      totalScore += behavioralSuspicion.score * behavioralSuspicion.weight;
      totalWeight += behavioralSuspicion.weight;
    }
    
    // Contextual factors
    if (contextualData.spatialContext || contextualData.temporalContext) {
      const contextualSuspicion = this._calculateContextualSuspicion(contextualData);
      factors.contextual = contextualSuspicion;
      totalScore += contextualSuspicion.score * contextualSuspicion.weight;
      totalWeight += contextualSuspicion.weight;
    }
    
    // Intent-based factors
    if (assessment.intentAnalysis) {
      const intentSuspicion = this._calculateIntentSuspicion(assessment.intentAnalysis);
      factors.intent = intentSuspicion;
      totalScore += intentSuspicion.score * intentSuspicion.weight;
      totalWeight += intentSuspicion.weight;
    }
    
    // Historical factors
    if (contextualData.historicalPatterns) {
      const historicalSuspicion = this._calculateHistoricalSuspicion(contextualData.historicalPatterns);
      factors.historical = historicalSuspicion;
      totalScore += historicalSuspicion.score * historicalSuspicion.weight;
      totalWeight += historicalSuspicion.weight;
    }
    
    // Environmental factors
    if (contextualData.environmentalContext) {
      const environmentalSuspicion = this._calculateEnvironmentalSuspicion(contextualData.environmentalContext);
      factors.environmental = environmentalSuspicion;
      totalScore += environmentalSuspicion.score * environmentalSuspicion.weight;
      totalWeight += environmentalSuspicion.weight;
    }
    
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0.5;
    
    return {
      score: Math.max(0, Math.min(1, finalScore)),
      factors,
      totalWeight,
      calculationMethod: 'weighted_average'
    };
  }

  _calculateBehavioralSuspicion(behavioralAnalysis) {
    const indicators = behavioralAnalysis.indicators || [];
    const anomalies = indicators.filter(indicator => indicator.anomaly === true);
    const suspiciousCount = anomalies.length;
    const totalCount = indicators.length;
    
    const score = totalCount > 0 ? suspiciousCount / totalCount : 0.5;
    const confidence = behavioralAnalysis.confidence || 0.7;
    
    return {
      score: score * confidence,
      weight: 0.4, // High weight for behavioral factors
      impact: score > 0.5 ? score - 0.5 : -(0.5 - score),
      reasoning: `${suspiciousCount} of ${totalCount} behavioral indicators show anomalies`,
      confidence
    };
  }

  _calculateContextualSuspicion(contextualData) {
    let suspicionFactors = [];
    
    // Time-based suspicion
    if (contextualData.temporalContext) {
      const timeScore = this._assessTimeBasedSuspicion(contextualData.temporalContext);
      suspicionFactors.push(timeScore);
    }
    
    // Location-based suspicion
    if (contextualData.spatialContext) {
      const locationScore = this._assessLocationBasedSuspicion(contextualData.spatialContext);
      suspicionFactors.push(locationScore);
    }
    
    const avgScore = suspicionFactors.length > 0 ?
      suspicionFactors.reduce((sum, factor) => sum + factor, 0) / suspicionFactors.length : 0.5;
    
    return {
      score: avgScore,
      weight: 0.25,
      impact: avgScore > 0.5 ? avgScore - 0.5 : -(0.5 - avgScore),
      reasoning: `Contextual analysis of ${suspicionFactors.length} factors`,
      confidence: 0.8
    };
  }

  _calculateIntentSuspicion(intentAnalysis) {
    const primaryIntent = intentAnalysis.primaryIntent;
    const intentConfidence = intentAnalysis.confidence || 0.5;
    
    // Map intents to suspicion levels
    const intentSuspicionMap = {
      'malicious': 0.9,
      'suspicious': 0.7,
      'unauthorized': 0.6,
      'unusual': 0.4,
      'normal': 0.2,
      'authorized': 0.1
    };
    
    const baseScore = intentSuspicionMap[primaryIntent] || 0.5;
    const adjustedScore = baseScore * intentConfidence;
    
    return {
      score: adjustedScore,
      weight: 0.3,
      impact: adjustedScore > 0.5 ? adjustedScore - 0.5 : -(0.5 - adjustedScore),
      reasoning: `Intent classified as '${primaryIntent}' with ${Math.round(intentConfidence * 100)}% confidence`,
      confidence: intentConfidence
    };
  }

  _calculateHistoricalSuspicion(historicalPatterns) {
    const deviationScore = historicalPatterns.deviationFromNorm || 0.5;
    const patternConfidence = historicalPatterns.confidence || 0.6;
    
    const adjustedScore = deviationScore * patternConfidence;
    
    return {
      score: adjustedScore,
      weight: 0.2,
      impact: adjustedScore > 0.5 ? adjustedScore - 0.5 : -(0.5 - adjustedScore),
      reasoning: `Historical pattern deviation: ${Math.round(deviationScore * 100)}%`,
      confidence: patternConfidence
    };
  }

  _calculateEnvironmentalSuspicion(environmentalContext) {
    const riskFactors = environmentalContext.riskFactors || [];
    const highRiskCount = riskFactors.filter(factor => factor.level === 'high').length;
    const totalFactors = riskFactors.length;
    
    const score = totalFactors > 0 ? highRiskCount / totalFactors : 0.3;
    
    return {
      score,
      weight: 0.15,
      impact: score > 0.5 ? score - 0.5 : -(0.5 - score),
      reasoning: `${highRiskCount} of ${totalFactors} environmental factors are high risk`,
      confidence: 0.7
    };
  }

  _assessTimeBasedSuspicion(temporalContext) {
    const hour = temporalContext.hour || 12;
    const dayOfWeek = temporalContext.dayOfWeek || 'monday';
    
    // Higher suspicion during off-hours
    let timeScore = 0.3; // Base score
    
    if (hour >= 22 || hour <= 6) {
      timeScore += 0.3; // Night hours
    } else if (hour >= 18 || hour <= 8) {
      timeScore += 0.1; // Early morning/evening
    }
    
    if (dayOfWeek === 'saturday' || dayOfWeek === 'sunday') {
      timeScore += 0.2; // Weekends
    }
    
    return Math.min(timeScore, 1.0);
  }

  _assessLocationBasedSuspicion(spatialContext) {
    const location = spatialContext.location || 'unknown';
    const accessLevel = spatialContext.accessLevel || 'public';
    
    // Higher suspicion in restricted areas
    const locationSuspicionMap = {
      'restricted': 0.8,
      'private': 0.6,
      'semi-private': 0.4,
      'public': 0.2
    };
    
    return locationSuspicionMap[accessLevel] || 0.5;
  }
}

/**
 * Uncertainty Handler
 * Handles uncertainty in suspicion calculations
 */
class UncertaintyHandler {
  async handleUncertainty(baseSuspicion, assessment, contextualData) {
    const uncertaintyFactors = [];
    let totalUncertainty = 0;
    
    // Data quality uncertainty
    const dataQualityUncertainty = this._assessDataQualityUncertainty(assessment, contextualData);
    uncertaintyFactors.push(dataQualityUncertainty);
    totalUncertainty += dataQualityUncertainty.uncertainty;
    
    // Model confidence uncertainty
    const modelUncertainty = this._assessModelUncertainty(baseSuspicion);
    uncertaintyFactors.push(modelUncertainty);
    totalUncertainty += modelUncertainty.uncertainty;
    
    // Contextual completeness uncertainty
    const contextualUncertainty = this._assessContextualUncertainty(contextualData);
    uncertaintyFactors.push(contextualUncertainty);
    totalUncertainty += contextualUncertainty.uncertainty;
    
    // Temporal uncertainty
    const temporalUncertainty = this._assessTemporalUncertainty(assessment);
    uncertaintyFactors.push(temporalUncertainty);
    totalUncertainty += temporalUncertainty.uncertainty;
    
    // Calculate uncertainty impact on suspicion
    const uncertaintyImpact = this._calculateUncertaintyImpact(totalUncertainty, baseSuspicion.score);
    
    return {
      totalUncertainty: Math.min(totalUncertainty, 1.0),
      factors: uncertaintyFactors,
      impact: uncertaintyImpact,
      adjustmentReasoning: this._explainUncertaintyAdjustment(uncertaintyFactors, uncertaintyImpact)
    };
  }

  _assessDataQualityUncertainty(assessment, contextualData) {
    let uncertainty = 0;
    const factors = [];
    
    // Missing behavioral data
    if (!assessment.behavioralAnalysis || !assessment.behavioralAnalysis.indicators) {
      uncertainty += 0.2;
      factors.push('Missing behavioral analysis data');
    }
    
    // Missing contextual data
    if (!contextualData.spatialContext && !contextualData.temporalContext) {
      uncertainty += 0.15;
      factors.push('Limited contextual information');
    }
    
    // Low confidence in input data
    if (assessment.dataQuality && assessment.dataQuality < 0.7) {
      uncertainty += (0.7 - assessment.dataQuality) * 0.3;
      factors.push('Low input data quality');
    }
    
    return {
      type: 'data_quality',
      description: 'Uncertainty due to data quality and completeness',
      uncertainty: Math.min(uncertainty, 0.5),
      factors
    };
  }

  _assessModelUncertainty(baseSuspicion) {
    let uncertainty = 0;
    
    // Low confidence in factor calculations
    const factorConfidences = Object.values(baseSuspicion.factors).map(factor => factor.confidence);
    const avgConfidence = factorConfidences.reduce((sum, conf) => sum + conf, 0) / factorConfidences.length;
    
    if (avgConfidence < 0.8) {
      uncertainty += (0.8 - avgConfidence) * 0.4;
    }
    
    // Insufficient factor diversity
    if (Object.keys(baseSuspicion.factors).length < 3) {
      uncertainty += 0.1;
    }
    
    return {
      type: 'model_confidence',
      description: 'Uncertainty in model calculations and factor analysis',
      uncertainty: Math.min(uncertainty, 0.3),
      factors: [`Average factor confidence: ${Math.round(avgConfidence * 100)}%`]
    };
  }

  _assessContextualUncertainty(contextualData) {
    let uncertainty = 0;
    const factors = [];
    
    // Missing historical context
    if (!contextualData.historicalPatterns) {
      uncertainty += 0.15;
      factors.push('No historical pattern data available');
    }
    
    // Incomplete environmental context
    if (!contextualData.environmentalContext) {
      uncertainty += 0.1;
      factors.push('Limited environmental context');
    }
    
    // Low confidence in contextual norms
    if (contextualData.normalPatterns && contextualData.normalPatterns.confidence < 0.7) {
      uncertainty += 0.1;
      factors.push('Low confidence in established norms');
    }
    
    return {
      type: 'contextual_completeness',
      description: 'Uncertainty due to incomplete contextual information',
      uncertainty: Math.min(uncertainty, 0.25),
      factors
    };
  }

  _assessTemporalUncertainty(assessment) {
    let uncertainty = 0;
    const factors = [];
    
    // Recent system startup (less historical data)
    const systemAge = assessment.systemAge || 0;
    if (systemAge < 7) { // Less than 7 days
      uncertainty += (7 - systemAge) * 0.02;
      factors.push('Limited historical data due to recent system deployment');
    }
    
    // Rapid environmental changes
    if (assessment.environmentalChangeRate && assessment.environmentalChangeRate > 0.5) {
      uncertainty += assessment.environmentalChangeRate * 0.1;
      factors.push('High rate of environmental changes affecting baseline');
    }
    
    return {
      type: 'temporal',
      description: 'Uncertainty due to temporal factors and system maturity',
      uncertainty: Math.min(uncertainty, 0.2),
      factors
    };
  }

  _calculateUncertaintyImpact(totalUncertainty, baseSuspicion) {
    // Uncertainty generally increases suspicion (conservative approach)
    // But very high uncertainty might decrease confidence in high suspicion
    
    if (totalUncertainty < 0.2) {
      return totalUncertainty * 0.1; // Minimal impact
    } else if (totalUncertainty < 0.4) {
      return totalUncertainty * 0.2; // Moderate impact
    } else {
      // High uncertainty - be more conservative
      if (baseSuspicion > 0.7) {
        return -totalUncertainty * 0.1; // Reduce high suspicion when very uncertain
      } else {
        return totalUncertainty * 0.3; // Increase low suspicion when uncertain
      }
    }
  }

  _explainUncertaintyAdjustment(uncertaintyFactors, impact) {
    const impactPercent = Math.round(Math.abs(impact) * 100);
    const direction = impact > 0 ? 'increased' : 'decreased';
    
    let explanation = `Uncertainty analysis ${direction} suspicion by ${impactPercent}%. `;
    explanation += 'Key uncertainty factors: ';
    explanation += uncertaintyFactors.map(factor => factor.description).join(', ');
    
    return explanation;
  }
}

/**
 * Confidence Manager
 * Manages confidence calculations for suspicion assessments
 */
class ConfidenceManager {
  async calculateConfidence(baseSuspicion, uncertaintyAdjustment, processingTrace) {
    const confidenceFactors = {};
    
    // Data confidence
    confidenceFactors.dataConfidence = this._calculateDataConfidence(processingTrace);
    
    // Model confidence
    confidenceFactors.modelConfidence = this._calculateModelConfidence(baseSuspicion);
    
    // Uncertainty confidence (inverse of uncertainty)
    confidenceFactors.uncertaintyConfidence = 1 - uncertaintyAdjustment.totalUncertainty;
    
    // Processing confidence
    confidenceFactors.processingConfidence = this._calculateProcessingConfidence(processingTrace);
    
    // Historical confidence
    confidenceFactors.historicalConfidence = this._calculateHistoricalConfidence();
    
    // Calculate weighted overall confidence
    const weights = {
      dataConfidence: 0.25,
      modelConfidence: 0.25,
      uncertaintyConfidence: 0.2,
      processingConfidence: 0.15,
      historicalConfidence: 0.15
    };
    
    const overallConfidence = Object.entries(confidenceFactors)
      .reduce((sum, [factor, value]) => sum + (value * weights[factor]), 0);
    
    return {
      overallConfidence: Math.max(0, Math.min(1, overallConfidence)),
      factors: confidenceFactors,
      weights,
      confidenceCategory: this._categorizeConfidence(overallConfidence)
    };
  }

  _calculateDataConfidence(processingTrace) {
    // Base confidence on data quality indicators
    let confidence = 0.7; // Base confidence
    
    if (processingTrace.dataQuality) {
      confidence = processingTrace.dataQuality;
    }
    
    // Adjust based on data completeness
    if (processingTrace.dataCompleteness) {
      confidence = (confidence + processingTrace.dataCompleteness) / 2;
    }
    
    return confidence;
  }

  _calculateModelConfidence(baseSuspicion) {
    // Base confidence on factor agreement and strength
    const factors = Object.values(baseSuspicion.factors);
    const avgFactorConfidence = factors.reduce((sum, factor) => sum + factor.confidence, 0) / factors.length;
    
    // Bonus for factor agreement (similar scores)
    const scores = factors.map(factor => factor.score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    const agreementBonus = Math.max(0, 0.2 - variance); // Lower variance = higher agreement
    
    return Math.min(1, avgFactorConfidence + agreementBonus);
  }

  _calculateProcessingConfidence(processingTrace) {
    let confidence = 0.8; // Base processing confidence
    
    // Adjust based on processing success
    if (processingTrace.errors && processingTrace.errors.length > 0) {
      confidence -= processingTrace.errors.length * 0.1;
    }
    
    // Adjust based on processing completeness
    if (processingTrace.completeness) {
      confidence = (confidence + processingTrace.completeness) / 2;
    }
    
    return Math.max(0.3, confidence);
  }

  _calculateHistoricalConfidence() {
    // This would be based on historical accuracy of similar assessments
    // For now, return a reasonable default
    return 0.75;
  }

  _categorizeConfidence(confidence) {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    if (confidence >= 0.4) return 'low';
    return 'very_low';
  }
}

/**
 * Adaptive Scoring
 * Adapts suspicion scoring based on historical patterns and feedback
 */
class AdaptiveScoring {
  constructor() {
    this.adaptationHistory = new Map();
    this.feedbackHistory = new Map();
    this.adaptationThresholds = {
      minimal: 0.1,
      low: 0.25,
      moderate: 0.4,
      elevated: 0.6,
      high: 0.8,
      critical: 0.95
    };
  }

  async adaptScore(baseSuspicion, uncertaintyAdjustment, contextualData, suspicionHistory) {
    const adaptationFactors = [];
    let totalAdaptation = 0;
    
    // Historical pattern adaptation
    const historicalAdaptation = await this._adaptBasedOnHistoricalPatterns(
      baseSuspicion,
      contextualData,
      suspicionHistory
    );
    if (historicalAdaptation.adjustment !== 0) {
      adaptationFactors.push(historicalAdaptation);
      totalAdaptation += historicalAdaptation.adjustment;
    }
    
    // Feedback-based adaptation
    const feedbackAdaptation = await this._adaptBasedOnFeedback(
      baseSuspicion,
      contextualData
    );
    if (feedbackAdaptation.adjustment !== 0) {
      adaptationFactors.push(feedbackAdaptation);
      totalAdaptation += feedbackAdaptation.adjustment;
    }
    
    // Environmental adaptation
    const environmentalAdaptation = await this._adaptBasedOnEnvironment(
      baseSuspicion,
      contextualData
    );
    if (environmentalAdaptation.adjustment !== 0) {
      adaptationFactors.push(environmentalAdaptation);
      totalAdaptation += environmentalAdaptation.adjustment;
    }
    
    // Apply adaptations with uncertainty consideration
    const baseScore = baseSuspicion.score + uncertaintyAdjustment.impact;
    const adaptedScore = baseScore + totalAdaptation;
    const finalScore = Math.max(0, Math.min(1, adaptedScore));
    
    return {
      finalScore,
      adaptationFactors,
      totalAdaptation,
      adaptationLevel: this._categorizeAdaptationLevel(Math.abs(totalAdaptation))
    };
  }

  async incorporateFeedback(suspicionData, feedback) {
    const feedbackId = `feedback-${Date.now()}`;
    
    this.feedbackHistory.set(feedbackId, {
      suspicionData,
      feedback,
      timestamp: Date.now()
    });
    
    // Update adaptation thresholds based on feedback
    await this._updateAdaptationThresholds(feedback);
    
    return feedbackId;
  }

  async getAdaptationImpact(feedback) {
    // Calculate how this feedback will impact future assessments
    const impact = {
      thresholdAdjustment: 0,
      patternLearning: 0,
      confidenceAdjustment: 0
    };
    
    if (feedback.accurate === false) {
      impact.thresholdAdjustment = feedback.actualThreat ? 0.05 : -0.05;
      impact.confidenceAdjustment = -0.1;
    } else {
      impact.confidenceAdjustment = 0.05;
    }
    
    return impact;
  }

  getCurrentThresholds() {
    return { ...this.adaptationThresholds };
  }

  // Private adaptation methods

  async _adaptBasedOnHistoricalPatterns(baseSuspicion, contextualData, suspicionHistory) {
    // Find similar historical cases
    const similarCases = this._findSimilarCases(contextualData, suspicionHistory);
    
    if (similarCases.length < 3) {
      return { adjustment: 0, description: 'Insufficient historical data for adaptation' };
    }
    
    // Calculate average outcome of similar cases
    const avgOutcome = similarCases.reduce((sum, case_) => {
      return sum + (case_.actualOutcome || case_.suspicionCategory === 'high' ? 0.8 : 0.2);
    }, 0) / similarCases.length;
    
    const currentPrediction = baseSuspicion.score;
    const adjustment = (avgOutcome - currentPrediction) * 0.2; // Conservative adjustment
    
    return {
      adjustment,
      description: `Historical pattern adaptation based on ${similarCases.length} similar cases`,
      confidence: Math.min(similarCases.length / 10, 1)
    };
  }

  async _adaptBasedOnFeedback(baseSuspicion, contextualData) {
    // Find relevant feedback for similar contexts
    const relevantFeedback = Array.from(this.feedbackHistory.values())
      .filter(entry => this._isSimilarContext(entry.suspicionData, contextualData))
      .slice(-10); // Last 10 relevant feedback entries
    
    if (relevantFeedback.length === 0) {
      return { adjustment: 0, description: 'No relevant feedback for adaptation' };
    }
    
    // Calculate feedback-based adjustment
    const feedbackAccuracy = relevantFeedback.filter(entry => entry.feedback.accurate).length / relevantFeedback.length;
    
    let adjustment = 0;
    if (feedbackAccuracy < 0.7) {
      // If we've been inaccurate, be more conservative
      adjustment = baseSuspicion.score > 0.5 ? -0.1 : 0.1;
    }
    
    return {
      adjustment,
      description: `Feedback-based adaptation (${Math.round(feedbackAccuracy * 100)}% accuracy in similar cases)`,
      confidence: Math.min(relevantFeedback.length / 5, 1)
    };
  }

  async _adaptBasedOnEnvironment(baseSuspicion, contextualData) {
    // Adapt based on environmental factors and time patterns
    let adjustment = 0;
    let description = 'Environmental adaptation';
    
    // Time-based adaptation
    if (contextualData.temporalContext) {
      const hour = contextualData.temporalContext.hour;
      if (hour >= 22 || hour <= 6) {
        // Night hours - typically higher baseline suspicion
        adjustment += 0.05;
        description += ' (night hours)';
      }
    }
    
    // Location-based adaptation
    if (contextualData.spatialContext && contextualData.spatialContext.riskLevel) {
      const riskLevel = contextualData.spatialContext.riskLevel;
      if (riskLevel === 'high') {
        adjustment += 0.1;
        description += ' (high-risk location)';
      } else if (riskLevel === 'low') {
        adjustment -= 0.05;
        description += ' (low-risk location)';
      }
    }
    
    return {
      adjustment,
      description,
      confidence: 0.8
    };
  }

  _findSimilarCases(contextualData, suspicionHistory) {
    const similarCases = [];
    
    suspicionHistory.forEach(case_ => {
      const similarity = this._calculateContextSimilarity(contextualData, case_.contextualData);
      if (similarity > 0.7) {
        similarCases.push({ ...case_, similarity });
      }
    });
    
    return similarCases.sort((a, b) => b.similarity - a.similarity);
  }

  _calculateContextSimilarity(context1, context2) {
    if (!context1 || !context2) return 0;
    
    let similarity = 0;
    let factors = 0;
    
    // Temporal similarity
    if (context1.temporalContext && context2.temporalContext) {
      const timeDiff = Math.abs(context1.temporalContext.hour - context2.temporalContext.hour);
      similarity += Math.max(0, 1 - timeDiff / 12);
      factors++;
    }
    
    // Spatial similarity
    if (context1.spatialContext && context2.spatialContext) {
      const locationMatch = context1.spatialContext.location === context2.spatialContext.location;
      similarity += locationMatch ? 1 : 0;
      factors++;
    }
    
    return factors > 0 ? similarity / factors : 0;
  }

  _isSimilarContext(suspicionData, contextualData) {
    return this._calculateContextSimilarity(suspicionData.contextualData, contextualData) > 0.6;
  }

  async _updateAdaptationThresholds(feedback) {
    // Adjust thresholds based on feedback accuracy
    if (feedback.accurate === false) {
      const category = feedback.predictedCategory;
      const actualThreat = feedback.actualThreat;
      
      if (actualThreat && category !== 'high' && category !== 'critical') {
        // We missed a threat - lower thresholds
        Object.keys(this.adaptationThresholds).forEach(key => {
          this.adaptationThresholds[key] = Math.max(0.05, this.adaptationThresholds[key] - 0.02);
        });
      } else if (!actualThreat && (category === 'high' || category === 'critical')) {
        // False alarm - raise thresholds
        Object.keys(this.adaptationThresholds).forEach(key => {
          this.adaptationThresholds[key] = Math.min(0.98, this.adaptationThresholds[key] + 0.02);
        });
      }
    }
  }

  _categorizeAdaptationLevel(totalAdaptation) {
    if (totalAdaptation >= 0.2) return 'high';
    if (totalAdaptation >= 0.1) return 'medium';
    if (totalAdaptation >= 0.05) return 'low';
    return 'minimal';
  }
}

/**
 * Adaptation Metrics
 * Tracks adaptation effectiveness and patterns
 */
class AdaptationMetrics {
  constructor() {
    this.metrics = {
      totalSuspicions: 0,
      confidenceScores: [],
      uncertaintyScores: [],
      adaptationLevels: { minimal: 0, low: 0, medium: 0, high: 0 },
      feedbackAccuracy: [],
      commonPatterns: new Map()
    };
  }

  recordSuspicion(suspicionAssessment) {
    this.metrics.totalSuspicions++;
    this.metrics.confidenceScores.push(suspicionAssessment.confidence);
    this.metrics.uncertaintyScores.push(suspicionAssessment.uncertainty);
    this.metrics.adaptationLevels[suspicionAssessment.adaptationLevel]++;
    
    // Record patterns
    const pattern = this._extractPattern(suspicionAssessment);
    const current = this.metrics.commonPatterns.get(pattern) || 0;
    this.metrics.commonPatterns.set(pattern, current + 1);
  }

  recordFeedback(assessmentId, feedback) {
    this.metrics.feedbackAccuracy.push(feedback.accurate);
  }

  getAverageConfidence() {
    if (this.metrics.confidenceScores.length === 0) return 0;
    return this.metrics.confidenceScores.reduce((sum, score) => sum + score, 0) / this.metrics.confidenceScores.length;
  }

  getUncertaintyTrends() {
    if (this.metrics.uncertaintyScores.length === 0) return { average: 0, trend: 'stable' };
    
    const average = this.metrics.uncertaintyScores.reduce((sum, score) => sum + score, 0) / this.metrics.uncertaintyScores.length;
    
    // Simple trend calculation (last 10 vs previous 10)
    const recent = this.metrics.uncertaintyScores.slice(-10);
    const previous = this.metrics.uncertaintyScores.slice(-20, -10);
    
    if (recent.length < 5 || previous.length < 5) {
      return { average, trend: 'insufficient_data' };
    }
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const previousAvg = previous.reduce((sum, score) => sum + score, 0) / previous.length;
    
    const trend = recentAvg > previousAvg + 0.05 ? 'increasing' :
                 recentAvg < previousAvg - 0.05 ? 'decreasing' : 'stable';
    
    return { average, trend, recentAvg, previousAvg };
  }

  getAdaptationEffectiveness() {
    if (this.metrics.feedbackAccuracy.length === 0) {
      return { accuracy: 0, totalFeedback: 0 };
    }
    
    const accuracy = this.metrics.feedbackAccuracy.filter(accurate => accurate).length / this.metrics.feedbackAccuracy.length;
    
    return {
      accuracy,
      totalFeedback: this.metrics.feedbackAccuracy.length,
      effectivenessCategory: accuracy >= 0.8 ? 'high' : accuracy >= 0.6 ? 'medium' : 'low'
    };
  }

  getCommonPatterns() {
    return Array.from(this.metrics.commonPatterns.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  }

  _extractPattern(suspicionAssessment) {
    const category = suspicionAssessment.suspicionCategory;
    const adaptationLevel = suspicionAssessment.adaptationLevel;
    const confidenceCategory = suspicionAssessment.confidence >= 0.8 ? 'high' :
                              suspicionAssessment.confidence >= 0.6 ? 'medium' : 'low';
    
    return `${category}-${adaptationLevel}-${confidenceCategory}`;
  }
}

export {
  GraduatedSuspicionSystem,
  SuspicionCalculator,
  UncertaintyHandler,
  ConfidenceManager,
  AdaptiveScoring,
  AdaptationMetrics
};
