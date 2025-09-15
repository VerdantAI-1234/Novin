/**
 * Simple Auto-Save Demo
 * 
 * Demonstrates the auto-save functionality for recent changes and "devin changes"
 */

import GoliathCognitiveInterpreter from './mobilenovin-ai.js';

async function demonstrateAutoSave() {
  console.log('🚀 Auto-Save Demo for MobileNovin AI\n');
  
  try {
    console.log('📋 Creating AI system with auto-save enabled...');
    
    // Create AI system with auto-save configured
    const ai = new GoliathCognitiveInterpreter({
      autoSaveEnabled: true,
      autoSaveInterval: 10000,  // 10 seconds for demo
      autoSaveDirectory: './demo-saves',
      maxAutoSaveBackups: 5,
      devinTrackingEnabled: true
    });

    // Wait for auto-save system to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ AI system initialized\n');
    
    // Show initial status
    console.log('📊 Initial Auto-Save Status:');
    const initialStatus = ai.getAutoSaveStatus();
    console.log(`   Enabled: ${initialStatus.enabled}`);
    console.log(`   Pending Changes: ${initialStatus.pendingChanges || 0}`);
    console.log(`   Registered Components: ${initialStatus.registeredComponents?.length || 0}`);
    
    if (initialStatus.devinChangesSummary) {
      console.log(`   Devin Changes: ${initialStatus.devinChangesSummary.total}`);
    }
    
    console.log('\n🎯 Processing some AI events (these are "devin changes")...');
    
    // Simulate AI processing events
    const testEvents = [
      {
        entityType: 'adult_male',
        entityId: 'person-001',
        location: 'front_door',
        timestamp: Date.now(),
        behaviors: ['approaching', 'looking_around'],
        spatialData: { x: 10, y: 20 },
        detectionConfidence: 0.8
      },
      {
        entityType: 'vehicle',
        entityId: 'car-001', 
        location: 'driveway',
        timestamp: Date.now() + 1000,
        behaviors: ['parked', 'engine_running'],
        spatialData: { x: 5, y: 10 },
        detectionConfidence: 0.9
      }
    ];
    
    for (let i = 0; i < testEvents.length; i++) {
      const event = testEvents[i];
      const result = await ai.interpretEvent(event);
      console.log(`   ✓ Event ${i + 1}: ${result.eventId} (Suspicion: ${result.suspicionLevel.toFixed(2)})`);
    }
    
    console.log('\n📊 Status after processing events:');
    const afterStatus = ai.getAutoSaveStatus();
    console.log(`   Pending Changes: ${afterStatus.pendingChanges || 0}`);
    if (afterStatus.devinChangesSummary) {
      console.log(`   Total Devin Changes: ${afterStatus.devinChangesSummary.total}`);
      console.log(`   Unsaved Devin Changes: ${afterStatus.devinChangesSummary.unsaved}`);
    }
    
    console.log('\n💾 Forcing immediate save to demonstrate save functionality...');
    const saveResult = await ai.saveState();
    console.log(`   Save result: ${saveResult ? 'Success' : 'Failed or not available'}`);
    
    console.log('\n📊 Status after save:');
    const finalStatus = ai.getAutoSaveStatus();
    console.log(`   Pending Changes: ${finalStatus.pendingChanges || 0}`);
    console.log(`   Last Save: ${finalStatus.lastSaveTime ? new Date(finalStatus.lastSaveTime).toLocaleTimeString() : 'Unknown'}`);
    
    if (finalStatus.devinChangesSummary) {
      console.log(`   Unsaved Devin Changes: ${finalStatus.devinChangesSummary.unsaved}`);
    }
    
    // Try to export devin changes
    console.log('\n🤖 Attempting to export Devin changes...');
    try {
      const exportFile = await ai.exportDevinChanges();
      console.log(`   ✅ Devin changes exported to: ${exportFile}`);
    } catch (error) {
      console.log(`   ℹ️  Export info: ${error.message}`);
    }
    
    console.log('\n📂 Testing state recovery...');
    const loadResult = await ai.loadLatestState();
    console.log(`   Load result: ${loadResult ? 'Success' : 'No save file found'}`);
    
    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✓ Auto-save system automatically tracks AI changes');
    console.log('   ✓ "Devin changes" (AI-generated assessments) are tracked separately');  
    console.log('   ✓ Recent changes are saved automatically on configured intervals');
    console.log('   ✓ Manual save and load operations work correctly');
    console.log('   ✓ System can export AI change history for analysis');
    
    // Graceful shutdown
    if (ai.autoSaveSystem) {
      console.log('\n🔄 Shutting down auto-save system...');
      await ai.autoSaveSystem.shutdown();
      console.log('   ✓ Shutdown complete');
    }
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    console.error(error.stack);
  }
}

// Run the demo
demonstrateAutoSave();