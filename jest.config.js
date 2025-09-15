/**
 * Jest Configuration for ES Modules
 * Supports the pure ES module setup for better bundling
 */

export default {
  // Use ES modules
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1'
  },
  transform: {},
  
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Coverage settings
  collectCoverage: false, // Disable for now to avoid complexity
  
  // Performance settings for mobile/edge deployment testing
  maxWorkers: 2,
  testTimeout: 10000,
  
  // Module resolution
  moduleFileExtensions: ['js', 'json'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Verbose output for debugging
  verbose: true
};