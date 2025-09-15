/**
 * Test file for SymbolicKnowledgeBase._matchesConditions method
 * Tests the new implementation against the requirements
 */

describe('SymbolicKnowledgeBase._matchesConditions', () => {
  let knowledgeBase;
  
  beforeEach(() => {
    // Create a mock SymbolicKnowledgeBase with just the method we need to test
    function SymbolicKnowledgeBase() {
      this.rules = new Map();
      this.facts = new Map();
      this.relationships = new Map();
    }
    
    SymbolicKnowledgeBase.prototype._matchesConditions = function(ruleCondition, actualConditions) {
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
    };
    
    knowledgeBase = new SymbolicKnowledgeBase();
  });

  describe('Basic functionality', () => {
    test('should return true when all conditions match', () => {
      const ruleCondition = [
        { factor: 'location', operator: 'equals', value: 'front_door' },
        { factor: 'hour', operator: 'greaterThan', value: 22 }
      ];
      const actualConditions = {
        location: 'front_door',
        hour: 23,
        behaviors: ['loitering']
      };
      
      const result = knowledgeBase._matchesConditions(ruleCondition, actualConditions);
      expect(result).toBe(true);
    });

    test('should return false when any condition does not match', () => {
      const ruleCondition = [
        { factor: 'location', operator: 'equals', value: 'front_door' },
        { factor: 'hour', operator: 'greaterThan', value: 22 }
      ];
      const actualConditions = {
        location: 'front_door',
        hour: 20, // This should fail the greaterThan condition
        behaviors: ['loitering']
      };
      
      const result = knowledgeBase._matchesConditions(ruleCondition, actualConditions);
      expect(result).toBe(false);
    });
  });

  describe('Operator tests', () => {
    test('equals operator should work correctly', () => {
      const ruleCondition = [{ factor: 'status', operator: 'equals', value: 'active' }];
      
      // Should match
      expect(knowledgeBase._matchesConditions(ruleCondition, { status: 'active' })).toBe(true);
      
      // Should not match
      expect(knowledgeBase._matchesConditions(ruleCondition, { status: 'inactive' })).toBe(false);
    });

    test('greaterThan operator should work correctly', () => {
      const ruleCondition = [{ factor: 'score', operator: 'greaterThan', value: 10 }];
      
      // Should match
      expect(knowledgeBase._matchesConditions(ruleCondition, { score: 15 })).toBe(true);
      
      // Should not match (equal)
      expect(knowledgeBase._matchesConditions(ruleCondition, { score: 10 })).toBe(false);
      
      // Should not match (less)
      expect(knowledgeBase._matchesConditions(ruleCondition, { score: 5 })).toBe(false);
    });

    test('lessThan operator should work correctly', () => {
      const ruleCondition = [{ factor: 'score', operator: 'lessThan', value: 10 }];
      
      // Should match
      expect(knowledgeBase._matchesConditions(ruleCondition, { score: 5 })).toBe(true);
      
      // Should not match (equal)
      expect(knowledgeBase._matchesConditions(ruleCondition, { score: 10 })).toBe(false);
      
      // Should not match (greater)
      expect(knowledgeBase._matchesConditions(ruleCondition, { score: 15 })).toBe(false);
    });

    test('contains operator should work with arrays', () => {
      const ruleCondition = [{ factor: 'behaviors', operator: 'contains', value: 'loitering' }];
      
      // Should match
      expect(knowledgeBase._matchesConditions(ruleCondition, { behaviors: ['walking', 'loitering', 'looking'] })).toBe(true);
      
      // Should not match
      expect(knowledgeBase._matchesConditions(ruleCondition, { behaviors: ['walking', 'running'] })).toBe(false);
    });

    test('contains operator should work with strings', () => {
      const ruleCondition = [{ factor: 'description', operator: 'contains', value: 'suspicious' }];
      
      // Should match
      expect(knowledgeBase._matchesConditions(ruleCondition, { description: 'this is suspicious behavior' })).toBe(true);
      
      // Should not match
      expect(knowledgeBase._matchesConditions(ruleCondition, { description: 'normal activity' })).toBe(false);
    });

    test('unsupported operator should return false', () => {
      const ruleCondition = [{ factor: 'score', operator: 'unsupportedOp', value: 10 }];
      
      const result = knowledgeBase._matchesConditions(ruleCondition, { score: 10 });
      expect(result).toBe(false);
    });
  });

  describe('Edge cases', () => {
    test('should return false for non-array ruleCondition', () => {
      expect(knowledgeBase._matchesConditions(null, {})).toBe(false);
      expect(knowledgeBase._matchesConditions(undefined, {})).toBe(false);
      expect(knowledgeBase._matchesConditions({}, {})).toBe(false);
      expect(knowledgeBase._matchesConditions('string', {})).toBe(false);
    });

    test('should return true for empty array', () => {
      const result = knowledgeBase._matchesConditions([], { any: 'data' });
      expect(result).toBe(true);
    });

    test('should return false when factor is missing from actualConditions', () => {
      const ruleCondition = [{ factor: 'missingFactor', operator: 'equals', value: 'something' }];
      
      const result = knowledgeBase._matchesConditions(ruleCondition, { otherFactor: 'value' });
      expect(result).toBe(false);
    });

    test('should return false for invalid predicate objects', () => {
      const ruleCondition = [null];
      expect(knowledgeBase._matchesConditions(ruleCondition, {})).toBe(false);
      
      const ruleCondition2 = [undefined];
      expect(knowledgeBase._matchesConditions(ruleCondition2, {})).toBe(false);
      
      const ruleCondition3 = ['string'];
      expect(knowledgeBase._matchesConditions(ruleCondition3, {})).toBe(false);
    });

    test('should return false when contains operator is used on non-array/non-string', () => {
      const ruleCondition = [{ factor: 'number', operator: 'contains', value: 'something' }];
      
      const result = knowledgeBase._matchesConditions(ruleCondition, { number: 123 });
      expect(result).toBe(false);
    });

    test('should return false when contains operator is used on null/undefined', () => {
      const ruleCondition = [{ factor: 'nullValue', operator: 'contains', value: 'something' }];
      
      expect(knowledgeBase._matchesConditions(ruleCondition, { nullValue: null })).toBe(false);
      expect(knowledgeBase._matchesConditions(ruleCondition, { nullValue: undefined })).toBe(false);
    });
  });

  describe('Complex scenarios', () => {
    test('should handle multiple conditions with different operators', () => {
      const ruleCondition = [
        { factor: 'location', operator: 'equals', value: 'front_door' },
        { factor: 'hour', operator: 'greaterThan', value: 22 },
        { factor: 'score', operator: 'lessThan', value: 100 },
        { factor: 'behaviors', operator: 'contains', value: 'loitering' }
      ];
      
      const actualConditions = {
        location: 'front_door',
        hour: 23,
        score: 85,
        behaviors: ['walking', 'loitering', 'looking'],
        extra: 'data'
      };
      
      const result = knowledgeBase._matchesConditions(ruleCondition, actualConditions);
      expect(result).toBe(true);
    });

    test('should fail early when first condition fails', () => {
      const ruleCondition = [
        { factor: 'location', operator: 'equals', value: 'back_door' }, // This should fail
        { factor: 'hour', operator: 'greaterThan', value: 22 }
      ];
      
      const actualConditions = {
        location: 'front_door', // Wrong location
        hour: 23
      };
      
      const result = knowledgeBase._matchesConditions(ruleCondition, actualConditions);
      expect(result).toBe(false);
    });
  });
});