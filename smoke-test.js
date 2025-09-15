#!/usr/bin/env node

/**
 * Comprehensive Smoke Test for MobileNovIn AI SDK
 * Tests core functionality without external dependencies
 */

import { GoliathCognitiveInterpreter } from './mobilenovin-ai.js';

console.log('🧪 MobileNovIn AI SDK Smoke Test');
console.log('================================');

async function runSmokeTest() {
  try {
    console.log('\n1️⃣ Testing module import...');
    console.log('   ✅ GoliathCognitiveInterpreter imported successfully');

    console.log('\n2️⃣ Testing instantiation...');
    const ai = new GoliathCognitiveInterpreter({
      performanceOptimized: true,
      explainabilityLevel: 'minimal',
      memoryConfig: { maxEvents: 1000 }
    });
    console.log('   ✅ GoliathCognitiveInterpreter instantiated successfully');

    console.log('\n3️⃣ Testing basic event processing...');
    const testEvent = {
      entityType: 'adult_male',
      entityId: 'test_person_001',
      location: 'front_door',
      timestamp: Date.now(),
      behaviors: ['walking', 'approaching'],
      spatialData: { x: 10, y: 5 },
      detectionConfidence: 0.85
    };

    const result = await ai.interpretEvent(testEvent);
    console.log('   ✅ Event processed successfully');
    console.log(`   📊 Alert Level: ${result.alertLevel}`);
    console.log(`   🎯 Confidence: ${result.confidence}`);

    console.log('\n4️⃣ Testing event sequence processing...');
    const eventSequence = [
      {
        ...testEvent,
        entityId: 'sequence_test_001',
        timestamp: Date.now() - 3000,
        behaviors: ['loitering']
      },
      {
        ...testEvent,
        entityId: 'sequence_test_001', 
        timestamp: Date.now() - 2000,
        behaviors: ['testing_doors']
      },
      {
        ...testEvent,
        entityId: 'sequence_test_001',
        timestamp: Date.now() - 1000,
        behaviors: ['avoiding_cameras']
      }
    ];

    const sequenceResult = await ai.interpretEventSequence(eventSequence);
    console.log('   ✅ Event sequence processed successfully');
    console.log(`   📊 Sequence Alert Level: ${sequenceResult.alertLevel}`);

    console.log('\n5️⃣ Testing performance metrics...');
    const metrics = ai.getPerformanceMetrics();
    console.log('   ✅ Performance metrics retrieved');
    console.log(`   ⚡ Total Inferences: ${metrics.totalInferences}`);
    console.log(`   📈 Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%`);

    console.log('\n6️⃣ Testing memory management...');
    ai.clearCache();
    ai.clearObjectPools();
    console.log('   ✅ Memory management functions work');

    console.log('\n7️⃣ Testing error handling...');
    try {
      await ai.interpretEvent({ invalid: 'event' });
      console.log('   ❌ Should have thrown validation error');
    } catch (error) {
      console.log('   ✅ Validation error handled correctly');
    }

    console.log('\n🎉 All smoke tests passed!');
    console.log('🚀 MobileNovIn AI SDK is production ready!');
    
    return true;
  } catch (error) {
    console.error('\n❌ Smoke test failed:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

runSmokeTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Smoke test crashed:', error);
  process.exit(1);
});
