/**
 * Auto-Save Test
 * 
 * Tests the auto-save functionality for the MobileNovin AI system
 */

import GoliathCognitiveInterpreter from './mobilenovin-ai.js';
import AutoSaveSystem from './auto-save-system.js';

async function testAutoSave() {
  console.log('🧪 Testing Auto-Save System...\n');
  
  try {
    // Create AI system with auto-save enabled
    const ai = new GoliathCognitiveInterpreter({
      autoSaveEnabled: true,
      autoSaveInterval: 5000, // 5 seconds for testing
      autoSaveDirectory: './test-auto-saves',
      maxAutoSaveBackups: 3,
      devinTrackingEnabled: true
    });

    console.log('✅ AI system initialized with auto-save');
    
    // Check auto-save status
    const status = ai.getAutoSaveStatus();
    console.log('📊 Auto-save status:', status);
    
    // Simulate some AI events
    console.log('\n🎯 Simulating AI event interpretations...');
    
    const testEvent = {
      entityType: 'adult_male',
      entityId: 'person-001',
      location: 'front_door',
      timestamp: Date.now(),
      behaviors: ['approaching', 'looking_around'],
      spatialData: { x: 10, y: 20, direction: 'north' },
      detectionConfidence: 0.8
    };
    
    // Process multiple events
    for (let i = 0; i < 3; i++) {
      const event = { ...testEvent, entityId: `person-${i.toString().padStart(3, '0')}` };
      const result = await ai.interpretEvent(event);
      console.log(`   Event ${i + 1}: ${result.eventId} - Suspicion: ${result.suspicionLevel.toFixed(2)}`);
    }
    
    // Wait a moment for auto-save to process
    console.log('\n⏳ Waiting for auto-save...');
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Check status again
    const statusAfter = ai.getAutoSaveStatus();
    console.log('📊 Auto-save status after events:', {
      pendingChanges: statusAfter.pendingChanges,
      timeSinceLastSave: statusAfter.timeSinceLastSave,
      devinChanges: statusAfter.devinChangesSummary.total
    });
    
    // Force save
    console.log('\n💾 Forcing immediate save...');
    await ai.saveState();
    
    // Export devin changes
    console.log('\n🤖 Exporting Devin changes...');
    try {
      const exportFile = await ai.exportDevinChanges();
      console.log(`✅ Devin changes exported to: ${exportFile}`);
    } catch (error) {
      console.log('📝 No Devin changes to export or export failed:', error.message);
    }
    
    // Test loading state
    console.log('\n📂 Testing state loading...');
    const loaded = await ai.loadLatestState();
    console.log(`${loaded ? '✅' : '❌'} State loading: ${loaded ? 'Success' : 'No save file found'}`);
    
    console.log('\n🎉 Auto-save test completed successfully!');
    
    // Shutdown gracefully
    if (ai.autoSaveSystem) {
      await ai.autoSaveSystem.shutdown();
    }
    
  } catch (error) {
    console.error('❌ Auto-save test failed:', error);
    throw error;
  }
}

// Run test if this is the main module
testAutoSave().catch(console.error);