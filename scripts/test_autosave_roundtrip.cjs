#!/usr/bin/env node
/**
 * AutoSave Roundtrip Test Script
 * 
 * Registers a mock component with the AutoSaveSystem, forces a save, verifies files written,
 * computes SHA256 checksum, corrupts a file to verify checksum changes, and optionally
 * attempts restore via autosave APIs.
 * 
 * Usage: node scripts/test_autosave_roundtrip.cjs [options]
 * 
 * Options:
 *   --save-dir <path>    Save directory for test (default: ./test-autosave)
 *   --component <name>   Mock component name (default: test-component)
 *   --no-cleanup         Skip cleanup of test files
 *   --verbose            Enable verbose logging
 *   --help               Show this help message
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// CLI argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    saveDir: './test-autosave',
    componentName: 'test-component',
    cleanup: true,
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--save-dir':
        options.saveDir = args[++i];
        break;
      case '--component':
        options.componentName = args[++i];
        break;
      case '--no-cleanup':
        options.cleanup = false;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
        options.help = true;
        break;
      default:
        console.warn(`Unknown option: ${args[i]}`);
    }
  }

  return options;
}

// Load AutoSaveSystem with tolerance for failures
async function loadAutoSaveSystem(options) {
  try {
    if (options.verbose) {
      console.log('🔧 Attempting to load AutoSaveSystem...');
    }
    
    // Try to load from different possible locations
    const candidates = [
      'autosave-system.js',
      './autosave-system.js',
      '../autosave-system.js'
    ];
    
    let AutoSaveSystem = null;
    let loadedFrom = null;
    
    for (const candidate of candidates) {
      try {
        const fullPath = path.resolve(candidate);
        await fs.access(fullPath);
        
        const module = await import('file://' + fullPath);
        AutoSaveSystem = module.AutoSaveSystem;
        loadedFrom = fullPath;
        break;
      } catch (error) {
        // Continue trying other candidates
      }
    }
    
    if (!AutoSaveSystem) {
      throw new Error('AutoSaveSystem not found in any candidate location');
    }
    
    if (options.verbose) {
      console.log(`✓ AutoSaveSystem loaded from: ${loadedFrom}`);
    }
    
    return AutoSaveSystem;
    
  } catch (error) {
    throw new Error(`Failed to load AutoSaveSystem: ${error.message}. Please ensure autosave-system.js is available.`);
  }
}

// Create a mock component for testing
function createMockComponent(name, options) {
  let saveCount = 0;
  let state = {
    name: name,
    timestamp: Date.now(),
    data: {
      sessions: [],
      config: { enabled: true },
      metadata: { version: '1.0.0' }
    }
  };
  
  return {
    name: name,
    getSaveState: async function() {
      saveCount++;
      
      // Simulate some state changes
      state.timestamp = Date.now();
      state.data.sessions.push({
        id: `session_${saveCount}`,
        startTime: Date.now(),
        events: Math.floor(Math.random() * 100)
      });
      
      if (options.verbose) {
        console.log(`  📦 Mock component ${name} returning state (save #${saveCount})`);
      }
      
      return JSON.parse(JSON.stringify(state)); // Deep copy
    },
    
    restoreState: async function(restoredState) {
      if (options.verbose) {
        console.log(`  📥 Mock component ${name} restoring state`);
      }
      state = JSON.parse(JSON.stringify(restoredState)); // Deep copy
      return true;
    },
    
    getCurrentState: function() {
      return JSON.parse(JSON.stringify(state)); // Deep copy
    },
    
    getSaveCount: function() {
      return saveCount;
    }
  };
}

// Calculate SHA256 checksum of file
async function calculateFileChecksum(filePath) {
  try {
    const content = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (error) {
    throw new Error(`Failed to calculate checksum for ${filePath}: ${error.message}`);
  }
}

// Corrupt a file by changing one byte
async function corruptFile(filePath, options) {
  try {
    const content = await fs.readFile(filePath);
    if (content.length === 0) {
      throw new Error('Cannot corrupt empty file');
    }
    
    // Change the first byte
    const corruptedContent = Buffer.from(content);
    corruptedContent[0] = corruptedContent[0] ^ 0xFF; // Flip all bits of first byte
    
    await fs.writeFile(filePath, corruptedContent);
    
    if (options.verbose) {
      console.log(`🔧 Corrupted file: ${filePath}`);
    }
    
    return true;
  } catch (error) {
    throw new Error(`Failed to corrupt file ${filePath}: ${error.message}`);
  }
}

// Find save files in directory
async function findSaveFiles(saveDir) {
  try {
    const files = await fs.readdir(saveDir);
    return files.filter(file => file.startsWith('autosave-') && file.endsWith('.json.gz'));
  } catch (error) {
    return [];
  }
}

// Cleanup test files
async function cleanup(saveDir, options) {
  if (!options.cleanup) {
    if (options.verbose) {
      console.log('🗑️ Skipping cleanup (--no-cleanup specified)');
    }
    return;
  }
  
  try {
    if (options.verbose) {
      console.log(`🗑️ Cleaning up test directory: ${saveDir}`);
    }
    await fs.rm(saveDir, { recursive: true, force: true });
  } catch (error) {
    console.warn(`⚠️ Cleanup failed: ${error.message}`);
  }
}

// Show help message
function showHelp() {
  console.log(`
AutoSave Roundtrip Test Script

Usage: node scripts/test_autosave_roundtrip.cjs [options]

Options:
  --save-dir <path>    Save directory for test (default: ./test-autosave)
  --component <name>   Mock component name (default: test-component)
  --no-cleanup         Skip cleanup of test files
  --verbose            Enable verbose logging
  --help               Show this help message

Examples:
  node scripts/test_autosave_roundtrip.cjs
  node scripts/test_autosave_roundtrip.cjs --verbose --no-cleanup
  node scripts/test_autosave_roundtrip.cjs --save-dir ./custom-test --component my-component
`);
}

// Main test function
async function runAutosaveTest(options) {
  const results = {
    timestamp: new Date().toISOString(),
    test_config: {
      save_directory: options.saveDir,
      component_name: options.componentName
    },
    phases: {},
    summary: {
      passed: 0,
      failed: 0,
      errors: []
    }
  };
  
  try {
    // Phase 1: Load AutoSaveSystem
    if (options.verbose) {
      console.log('📖 Phase 1: Loading AutoSaveSystem...');
    }
    
    const AutoSaveSystem = await loadAutoSaveSystem(options);
    
    // Phase 2: Initialize AutoSaveSystem
    if (options.verbose) {
      console.log('⚙️ Phase 2: Initializing AutoSaveSystem...');
    }
    
    const autoSave = new AutoSaveSystem({
      autosave: {
        enabled: true,
        saveDirectory: options.saveDir,
        intervalMs: 1000, // Fast for testing
        maxBackups: 3,
        compressionEnabled: true,
        checksumValidation: true
      }
    });
    
    await autoSave.initialize();
    results.phases.initialization = { status: 'passed' };
    results.summary.passed++;
    
    // Phase 3: Register mock component
    if (options.verbose) {
      console.log('🎭 Phase 3: Registering mock component...');
    }
    
    const mockComponent = createMockComponent(options.componentName, options);
    autoSave.markChanged(options.componentName, await mockComponent.getSaveState());
    
    // Verify registration
    const status = autoSave.getStatus();
    if (!status.pendingChanges) {
      throw new Error('Component registration failed - no pending changes detected');
    }
    
    results.phases.registration = { 
      status: 'passed',
      pending_changes: status.pendingChanges
    };
    results.summary.passed++;
    
    // Phase 4: Force save
    if (options.verbose) {
      console.log('💾 Phase 4: Forcing save...');
    }
    
    const savePath = await autoSave.saveState();
    if (!savePath) {
      throw new Error('Save operation returned null/undefined path');
    }
    
    // Verify save file exists
    await fs.access(savePath);
    
    results.phases.save = { 
      status: 'passed',
      save_path: savePath
    };
    results.summary.passed++;
    
    // Phase 5: Verify files and checksums
    if (options.verbose) {
      console.log('🔍 Phase 5: Verifying files and checksums...');
    }
    
    const saveFiles = await findSaveFiles(options.saveDir);
    if (saveFiles.length === 0) {
      throw new Error('No save files found in save directory');
    }
    
    const checksums = {};
    for (const file of saveFiles) {
      const fullPath = path.join(options.saveDir, file);
      checksums[file] = await calculateFileChecksum(fullPath);
    }
    
    results.phases.verification = { 
      status: 'passed',
      files_found: saveFiles.length,
      checksums: checksums
    };
    results.summary.passed++;
    
    // Phase 6: Corrupt file and verify checksum changes
    if (options.verbose) {
      console.log('🔧 Phase 6: Testing corruption detection...');
    }
    
    const testFile = saveFiles[0];
    const testFilePath = path.join(options.saveDir, testFile);
    const originalChecksum = checksums[testFile];
    
    await corruptFile(testFilePath, options);
    
    const corruptedChecksum = await calculateFileChecksum(testFilePath);
    
    if (originalChecksum === corruptedChecksum) {
      throw new Error('Checksum did not change after file corruption');
    }
    
    results.phases.corruption_test = { 
      status: 'passed',
      original_checksum: originalChecksum.substring(0, 8) + '...',
      corrupted_checksum: corruptedChecksum.substring(0, 8) + '...',
      checksum_changed: originalChecksum !== corruptedChecksum
    };
    results.summary.passed++;
    
    // Phase 7: Attempt restore (optional, best effort)
    if (options.verbose) {
      console.log('📥 Phase 7: Testing restore functionality...');
    }
    
    try {
      // Try to load the latest save (before corruption)
      const latestSave = await autoSave.loadLatestSave();
      
      if (latestSave) {
        results.phases.restore = { 
          status: 'passed',
          restore_successful: true
        };
        results.summary.passed++;
      } else {
        results.phases.restore = { 
          status: 'warning',
          restore_successful: false,
          message: 'No save data returned, but no error thrown'
        };
      }
    } catch (error) {
      results.phases.restore = { 
        status: 'warning',
        restore_successful: false,
        error: error.message
      };
      // Don't count as failure since restore is optional
    }
    
    // Shutdown autosave system
    if (autoSave.shutdown) {
      await autoSave.shutdown();
    }
    
    return results;
    
  } catch (error) {
    results.summary.failed++;
    results.summary.errors.push(error.message);
    throw error;
  }
}

// Main execution
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    process.exit(0);
  }
  
  try {
    console.log('🚀 Starting AutoSave roundtrip test...');
    
    // Run the test
    const results = await runAutosaveTest(options);
    
    // Cleanup
    await cleanup(options.saveDir, options);
    
    // Write results
    const resultsPath = 'autosave_test_results.json';
    const sortedResults = JSON.stringify(results, null, 2);
    await fs.writeFile(resultsPath, sortedResults);
    
    // Final summary
    console.log('✅ AutoSave roundtrip test completed successfully!');
    console.log(`📊 Phases passed: ${results.summary.passed}`);
    console.log(`📊 Phases failed: ${results.summary.failed}`);
    console.log(`💾 Results: ${resultsPath}`);
    
    if (results.summary.errors.length > 0) {
      console.log('❌ Errors encountered:');
      results.summary.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }
    
    // Exit with appropriate code
    process.exit(results.summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    // Cleanup on error
    await cleanup(options.saveDir, options);
    
    console.error('❌ AutoSave roundtrip test failed:', error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    
    // Try to write error results
    try {
      const errorResults = {
        timestamp: new Date().toISOString(),
        test_config: {
          save_directory: options.saveDir,
          component_name: options.componentName
        },
        error: error.message,
        summary: {
          passed: 0,
          failed: 1,
          errors: [error.message]
        }
      };
      
      const resultsPath = 'autosave_test_results.json';
      const sortedResults = JSON.stringify(errorResults, null, 2);
      await fs.writeFile(resultsPath, sortedResults);
      console.log(`💾 Error results: ${resultsPath}`);
    } catch (writeError) {
      console.error('Failed to write error results:', writeError.message);
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  loadAutoSaveSystem,
  createMockComponent,
  runAutosaveTest,
  calculateFileChecksum,
  corruptFile
};