/**
 * SymbolicKnowledgeBase Tests
 * Tests for the _matchesConditions predicate evaluation logic
 */

// Mock SymbolicKnowledgeBase for testing the condition matching
class MockSymbolicKnowledgeBase {
  constructor() {
    this.rules = new Map();
    this.facts = new Map();
    this.relationships = new Map();
  }

  addRule(id, condition, conclusion, confidence) {
    this.rules.set(id, { condition, conclusion, confidence });
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
    // Handle null or undefined conditions
    if (!ruleCondition) {
      return false;
    }
    
    // Handle simple boolean conditions
    if (typeof ruleCondition === 'boolean') {
      return ruleCondition;
    }
    
    // Handle array of conditions (AND logic - all must be true)
    if (Array.isArray(ruleCondition)) {
      // Short-circuit evaluation: return false on first false condition
      for (const condition of ruleCondition) {
        if (!this._evaluatePredicate(condition, actualConditions)) {
          return false;
        }
      }
      return true;
    }
    
    // Handle single condition object
    if (typeof ruleCondition === 'object') {
      return this._evaluatePredicate(ruleCondition, actualConditions);
    }
    
    // Default to false for unsupported condition types
    return false;
  }
  
  _evaluatePredicate(predicate, actualConditions) {
    // Handle null or undefined predicates
    if (!predicate || !actualConditions) {
      return false;
    }
    
    const { field, operator, value } = predicate;
    
    // Ensure required fields are present
    if (!field || !operator || value === undefined) {
      return false;
    }
    
    // Get the actual value from conditions
    const actualValue = this._getFieldValue(field, actualConditions);
    
    // Handle cases where field doesn't exist in actual conditions
    if (actualValue === undefined) {
      return false;
    }
    
    // Evaluate based on operator
    switch (operator) {
      case 'equals':
        return actualValue === value;
        
      case 'greaterThan':
        return actualValue > value;
        
      case 'lessThan':
        return actualValue < value;
        
      case 'contains':
        // Handle string contains
        if (typeof actualValue === 'string' && typeof value === 'string') {
          return actualValue.includes(value);
        }
        // Handle array contains
        if (Array.isArray(actualValue)) {
          return actualValue.includes(value);
        }
        return false;
        
      default:
        // Default to false for unsupported operators
        return false;
    }
  }
  
  _getFieldValue(field, conditions) {
    // Support dot notation for nested fields (e.g., "entity.type")
    const fieldParts = field.split('.');
    let currentValue = conditions;
    
    for (const part of fieldParts) {
      if (currentValue && typeof currentValue === 'object' && part in currentValue) {
        currentValue = currentValue[part];
      } else {
        return undefined;
      }
    }
    
    return currentValue;
  }
}

describe('SymbolicKnowledgeBase _matchesConditions', () => {
  let knowledgeBase;

  beforeEach(() => {
    knowledgeBase = new MockSymbolicKnowledgeBase();
  });

  describe('Boolean Conditions', () => {
    test('should return true for true boolean condition', () => {
      expect(knowledgeBase._matchesConditions(true, {})).toBe(true);
    });

    test('should return false for false boolean condition', () => {
      expect(knowledgeBase._matchesConditions(false, {})).toBe(false);
    });
  });

  describe('Null/Undefined Conditions', () => {
    test('should return false for null condition', () => {
      expect(knowledgeBase._matchesConditions(null, {})).toBe(false);
    });

    test('should return false for undefined condition', () => {
      expect(knowledgeBase._matchesConditions(undefined, {})).toBe(false);
    });
  });

  describe('Single Predicate Conditions', () => {
    const testConditions = {
      entityType: 'person',
      suspicionLevel: 0.8,
      location: 'front_door',
      behaviors: ['avoiding_cameras', 'looking_around'],
      entity: {
        type: 'adult_male',
        confidence: 0.9
      }
    };

    test('should match equals operator correctly', () => {
      const condition = { field: 'entityType', operator: 'equals', value: 'person' };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(true);
      
      const failCondition = { field: 'entityType', operator: 'equals', value: 'vehicle' };
      expect(knowledgeBase._matchesConditions(failCondition, testConditions)).toBe(false);
    });

    test('should match greaterThan operator correctly', () => {
      const condition = { field: 'suspicionLevel', operator: 'greaterThan', value: 0.5 };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(true);
      
      const failCondition = { field: 'suspicionLevel', operator: 'greaterThan', value: 0.9 };
      expect(knowledgeBase._matchesConditions(failCondition, testConditions)).toBe(false);
    });

    test('should match lessThan operator correctly', () => {
      const condition = { field: 'suspicionLevel', operator: 'lessThan', value: 0.9 };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(true);
      
      const failCondition = { field: 'suspicionLevel', operator: 'lessThan', value: 0.5 };
      expect(knowledgeBase._matchesConditions(failCondition, testConditions)).toBe(false);
    });

    test('should match contains operator for arrays', () => {
      const condition = { field: 'behaviors', operator: 'contains', value: 'avoiding_cameras' };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(true);
      
      const failCondition = { field: 'behaviors', operator: 'contains', value: 'normal_walking' };
      expect(knowledgeBase._matchesConditions(failCondition, testConditions)).toBe(false);
    });

    test('should match contains operator for strings', () => {
      const condition = { field: 'location', operator: 'contains', value: 'door' };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(true);
      
      const failCondition = { field: 'location', operator: 'contains', value: 'window' };
      expect(knowledgeBase._matchesConditions(failCondition, testConditions)).toBe(false);
    });

    test('should support nested field access with dot notation', () => {
      const condition = { field: 'entity.type', operator: 'equals', value: 'adult_male' };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(true);
      
      const condition2 = { field: 'entity.confidence', operator: 'greaterThan', value: 0.8 };
      expect(knowledgeBase._matchesConditions(condition2, testConditions)).toBe(true);
    });

    test('should return false for non-existent fields', () => {
      const condition = { field: 'nonExistentField', operator: 'equals', value: 'anything' };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(false);
    });

    test('should return false for unsupported operators', () => {
      const condition = { field: 'entityType', operator: 'unsupportedOp', value: 'person' };
      expect(knowledgeBase._matchesConditions(condition, testConditions)).toBe(false);
    });

    test('should return false for malformed predicates', () => {
      expect(knowledgeBase._matchesConditions({ field: 'entityType' }, testConditions)).toBe(false);
      expect(knowledgeBase._matchesConditions({ operator: 'equals' }, testConditions)).toBe(false);
      expect(knowledgeBase._matchesConditions({ field: 'entityType', operator: 'equals' }, testConditions)).toBe(false);
    });
  });

  describe('Array Conditions (AND Logic)', () => {
    const testConditions = {
      entityType: 'person',
      suspicionLevel: 0.8,
      location: 'front_door',
      behaviors: ['avoiding_cameras', 'looking_around']
    };

    test('should return true when all conditions are met', () => {
      const conditions = [
        { field: 'entityType', operator: 'equals', value: 'person' },
        { field: 'suspicionLevel', operator: 'greaterThan', value: 0.5 },
        { field: 'behaviors', operator: 'contains', value: 'avoiding_cameras' }
      ];
      expect(knowledgeBase._matchesConditions(conditions, testConditions)).toBe(true);
    });

    test('should return false when any condition fails (short-circuit)', () => {
      const conditions = [
        { field: 'entityType', operator: 'equals', value: 'person' },
        { field: 'suspicionLevel', operator: 'lessThan', value: 0.5 }, // This will fail
        { field: 'behaviors', operator: 'contains', value: 'avoiding_cameras' }
      ];
      expect(knowledgeBase._matchesConditions(conditions, testConditions)).toBe(false);
    });

    test('should handle empty condition arrays', () => {
      expect(knowledgeBase._matchesConditions([], testConditions)).toBe(true);
    });

    test('should handle mixed valid and invalid conditions', () => {
      const conditions = [
        { field: 'entityType', operator: 'equals', value: 'person' },
        { field: 'nonExistentField', operator: 'equals', value: 'anything' } // This will fail
      ];
      expect(knowledgeBase._matchesConditions(conditions, testConditions)).toBe(false);
    });
  });

  describe('Integration with queryRules', () => {
    test('should filter rules correctly using condition matching', () => {
      const testConditions = {
        entityType: 'person',
        suspicionLevel: 0.8,
        location: 'front_door'
      };

      // Add rules with different conditions
      knowledgeBase.addRule('rule1', 
        { field: 'entityType', operator: 'equals', value: 'person' },
        'High suspicion for person',
        0.9
      );
      
      knowledgeBase.addRule('rule2',
        { field: 'entityType', operator: 'equals', value: 'vehicle' },
        'High suspicion for vehicle',
        0.8
      );
      
      knowledgeBase.addRule('rule3',
        [
          { field: 'entityType', operator: 'equals', value: 'person' },
          { field: 'suspicionLevel', operator: 'greaterThan', value: 0.5 }
        ],
        'Very high suspicion',
        0.95
      );

      const matchingRules = knowledgeBase.queryRules(testConditions);
      
      expect(matchingRules).toHaveLength(2);
      expect(matchingRules.map(r => r.ruleId)).toEqual(['rule1', 'rule3']);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null actualConditions', () => {
      const condition = { field: 'entityType', operator: 'equals', value: 'person' };
      expect(knowledgeBase._matchesConditions(condition, null)).toBe(false);
    });

    test('should handle undefined actualConditions', () => {
      const condition = { field: 'entityType', operator: 'equals', value: 'person' };
      expect(knowledgeBase._matchesConditions(condition, undefined)).toBe(false);
    });

    test('should handle non-object condition types', () => {
      expect(knowledgeBase._matchesConditions('string', {})).toBe(false);
      expect(knowledgeBase._matchesConditions(123, {})).toBe(false);
    });

    test('should handle zero and falsy values correctly', () => {
      const testConditions = { count: 0, flag: false, text: '' };
      
      expect(knowledgeBase._matchesConditions(
        { field: 'count', operator: 'equals', value: 0 }, 
        testConditions
      )).toBe(true);
      
      expect(knowledgeBase._matchesConditions(
        { field: 'flag', operator: 'equals', value: false }, 
        testConditions
      )).toBe(true);
      
      expect(knowledgeBase._matchesConditions(
        { field: 'text', operator: 'equals', value: '' }, 
        testConditions
      )).toBe(true);
    });
  });
});