#!/usr/bin/env node

/**
 * Verification script for defensive guards and production improvements
 * Tests edge cases that could cause NaN or divide-by-zero errors
 */

import { GoliathCognitiveInterpreter } from './mobilenovin-ai.js';
import { DEFAULT_CONFIG, validateConfig, mergeConfig } from './config-schema.js';
import { AutoSaveSystem } from './autosave-system.js';

console.log('🛡️  Defensive Guards Verification');
console.log('=================================');

async function testDefensiveGuards() {
  let passed = 0;
  let failed = 0;
  
  async function test(name, testFn) {
    try {
      const result = await testFn();
      if (result === true || (typeof result === 'number' && !isNaN(result))) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name} - returned: ${result}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name} - error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n1️⃣ Testing Configuration Schema...');
  
  await test('DEFAULT_CONFIG validation', () => {
    const errors = validateConfig(DEFAULT_CONFIG);
    return errors.length === 0;
  });
  
  await test('Invalid config rejection', () => {
    const errors = validateConfig({ confidenceThreshold: 1.5 });
    return errors.length > 0;
  });
  
  await test('Config merging', () => {
    const merged = mergeConfig(DEFAULT_CONFIG, { suspicionThresholds: { critical: 0.9 } });
    return merged.suspicionThresholds.critical === 0.9 && 
           merged.suspicionThresholds.info === DEFAULT_CONFIG.suspicionThresholds.info;
  });
  
  console.log('\n2️⃣ Testing GoliathCognitiveInterpreter with edge cases...');
  
  const ai = new GoliathCognitiveInterpreter({
    autosave: { enabled: false } // Disable for testing
  });
  
  test('Empty behaviors array', async () => {
    const result = await ai.interpretEvent({
      entityType: 'unknown',
      entityId: 'test_001',
      location: 'test',
      timestamp: Date.now(),
      behaviors: [], // Empty array
      spatialData: {},
      detectionConfidence: 0.5
    });
    return result && typeof result.confidence === 'number' && !isNaN(result.confidence);
  });
  
  test('Invalid detection confidence', async () => {
    const result = await ai.interpretEvent({
      entityType: 'adult_male',
      entityId: 'test_002',
      location: 'test',
      timestamp: Date.now(),
      behaviors: ['walking'],
      spatialData: { x: 0, y: 0 },
      detectionConfidence: NaN // Invalid confidence
    });
    return result && typeof result.confidence === 'number' && !isNaN(result.confidence);
  });
  
  test('Empty event sequence', async () => {
    const result = await ai.interpretEventSequence([]);
    return result && typeof result.confidence === 'number' && !isNaN(result.confidence);
  });
  
  console.log('\n3️⃣ Testing AutoSave System...');
  
  const testDir = './test-verify-autosave';
  const autoSave = new AutoSaveSystem({
    autosave: {
      saveDirectory: testDir,
      intervalMs: 1000,
      maxBackups: 2
    }
  });
  
  await test('AutoSave initialization', async () => {
    await autoSave.initialize();
    return autoSave.isInitialized;
  });
  
  await test('Mark and save changes', async () => {
    autoSave.markChanged('testComponent', { data: 'test' });
    const savedPath = await autoSave.saveState();
    return savedPath !== null;
  });
  
  await test('Load latest save', async () => {
    const loaded = await autoSave.loadLatestSave();
    return loaded !== null && loaded.components && loaded.components.testComponent;
  });
  
  await autoSave.shutdown();
  
  console.log('\n4️⃣ Testing Configuration Validation Edge Cases...');
  
  await test('Suspicion thresholds order validation', () => {
    const errors = validateConfig({
      ...DEFAULT_CONFIG,
      suspicionThresholds: { info: 0.8, standard: 0.6, elevated: 0.3, critical: 0.1 }
    });
    return errors.length > 0;
  });
  
  await test('Intent weights sum validation', () => {
    const errors = validateConfig({
      ...DEFAULT_CONFIG,
      intentWeights: { behavioral: 0.1, contextual: 0.1, temporal: 0.1, spatial: 0.1, classification: 0.1 }
    });
    return errors.length > 0;
  });
  
  await test('Fallback values range validation', () => {
    const errors = validateConfig({
      ...DEFAULT_CONFIG,
      fallbackValues: { reliability: 1.5, confidence: -0.2 }
    });
    return errors.length > 0;
  });
  
  console.log('\n5️⃣ Testing GoliathCognitiveInterpreter Configuration Integration...');
  
  await test('Custom config merging in constructor', () => {
    const customAI = new GoliathCognitiveInterpreter({
      suspicionThresholds: { critical: 0.9 },
      intentWeights: { behavioral: 0.4 },
      autosave: { enabled: false }
    });
    return customAI.config.suspicionThresholds.critical === 0.9 &&
           customAI.config.suspicionThresholds.info === DEFAULT_CONFIG.suspicionThresholds.info &&
           customAI.config.intentWeights.behavioral === 0.4;
  });
  
  await test('Invalid config rejection in constructor', () => {
    try {
      new GoliathCognitiveInterpreter({
        confidenceThreshold: 1.5 // Invalid
      });
      return false; // Should have thrown
    } catch (error) {
      return error.message.includes('Configuration validation failed');
    }
  });
  
  console.log('\n📊 Results Summary');
  console.log('==================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All defensive guards and production improvements verified!');
    console.log('🚀 MobileNovIn AI SDK is production-ready with enhanced reliability!');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please review the defensive guards implementation.');
    return false;
  }
}

async function cleanup() {
  try {
    const fs = await import('fs/promises');
    await fs.rm('./test-verify-autosave', { recursive: true, force: true });
  } catch (error) {
  }
}

testDefensiveGuards()
  .then(success => cleanup().then(() => process.exit(success ? 0 : 1)))
  .catch(error => {
    console.error('❌ Verification failed:', error);
    cleanup().then(() => process.exit(1));
  });
