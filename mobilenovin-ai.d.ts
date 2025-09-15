/**
 * Goliath Cognitive Interpreter - TypeScript Definitions
 * Edge-native AI for contextual security reasoning and embodied cognition
 */

export interface PerceptionEvent {
  id: string;
  timestamp: number;
  entityId: string;
  eventType: string;
  location: {
    x: number;
    y: number;
    zone?: string;
  };
  detectionConfidence: number;
  behaviors?: string[];
  metadata?: Record<string, any>;
}

export interface CognitiveAssessment {
  eventId: string;
  suspicionLevel: number;
  confidence: number;
  reasoning: string;
  factors: string[];
  processingLatency: number;
  cognitiveConfidence: number;
  spatialContext?: any;
  intentAnalysis?: any;
  temporalFactors?: any;
}

export interface CognitiveConfig {
  maxMemorySize?: number;
  learningRate?: number;
  suspicionThreshold?: number;
  confidenceThreshold?: number;
  processingTimeout?: number;
  enableAdaptiveLearning?: boolean;
  spatialResolution?: number;
  temporalWindow?: number;
}

export interface IntentAnalysis {
  primaryIntent: string;
  confidence: number;
  intentStrength: number;
  behavioralPatterns: string[];
  riskFactors?: string[];
  contextualFactors?: Record<string, any>;
}

export interface SpatialContext {
  currentZone: string;
  nearbyEntities: any[];
  environmentalFactors: string[];
  spatialRisk: number;
}

export interface SymbolicReasoning {
  suspicionLevel: number;
  confidence: number;
  reasoning: string;
  factors: string[];
}

export class CognitiveError extends Error {
  constructor(message: string, code?: string);
  code?: string;
}

export class ContextualMemorySystem {
  constructor(config?: CognitiveConfig);
  store(eventId: string, assessment: CognitiveAssessment): Promise<void>;
  retrieve(eventId: string): Promise<CognitiveAssessment | null>;
  getRecentEvents(timeWindow: number): Promise<CognitiveAssessment[]>;
  cleanup(): Promise<void>;
}

export class GoliathCognitiveInterpreter {
  constructor(config?: CognitiveConfig);
  
  /**
   * Main interpretation method - processes perception events into cognitive assessments
   */
  interpretEvent(perceptionEvent: PerceptionEvent): Promise<CognitiveAssessment>;
  
  /**
   * Batch processing for multiple events
   */
  interpretBatch(events: PerceptionEvent[]): Promise<CognitiveAssessment[]>;
  
  /**
   * Get current spatial awareness state
   */
  getSpatialAwareness(): any;
  
  /**
   * Get explanation for a specific decision
   */
  explainDecision(eventId: string): any;
  
  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CognitiveConfig>): void;
  
  /**
   * Get current performance metrics
   */
  getMetrics(): {
    averageLatency: number;
    totalEvents: number;
    memoryUsage: number;
    cacheHitRate: number;
  };
  
  /**
   * Cleanup resources
   */
  cleanup(): Promise<void>;
}

export default GoliathCognitiveInterpreter;

// Factory functions for different deployment profiles
export function createAccuracyOptimized(config?: CognitiveConfig): GoliathCognitiveInterpreter;
export function createPerformanceOptimized(config?: CognitiveConfig): GoliathCognitiveInterpreter;
export function createMobileOptimized(config?: CognitiveConfig): GoliathCognitiveInterpreter;