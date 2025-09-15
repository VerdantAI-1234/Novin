/**
 * Tests for autosave system integration with GoliathCognitiveInterpreter
 */
import { GoliathCognitiveInterpreter } from '../../mobilenovin-ai.js';
import { AutoSaveSystem } from '../../autosave-system.js';
import fs from 'fs/promises';
import path from 'path';

describe('AutoSave Integration', () => {
  let interpreter;
  let testDir;
  
  beforeEach(async () => {
    testDir = path.join(process.cwd(), 'test-autosave-integration');
    interpreter = new GoliathCognitiveInterpreter({
      autosave: {
        enabled: true,
        saveDirectory: testDir,
        intervalMs: 100, // Fast for testing
        maxBackups: 3
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 50));
  });
  
  afterEach(async () => {
    try {
      if (interpreter.autoSaveSystem) {
        await interpreter.autoSaveSystem.shutdown();
      }
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
    }
  });
  
  test('autosave system initializes correctly', () => {
    expect(interpreter.autoSaveSystem).toBeInstanceOf(AutoSaveSystem);
    expect(interpreter.autoSaveSystem.config.enabled).toBe(true);
    expect(interpreter.autoSaveSystem.config.saveDirectory).toBe(testDir);
  });
  
  test('saveState and loadLatestState lifecycle', async () => {
    const testEvent = {
      entityType: 'adult_male',
      entityId: 'test_001',
      location: 'test_zone',
      timestamp: Date.now(),
      behaviors: ['walking'],
      spatialData: { x: 0, y: 0 },
      detectionConfidence: 0.8
    };
    
    await interpreter.interpretEvent(testEvent);
    
    const savedPath = await interpreter.saveState();
    expect(savedPath).toBeTruthy();
    
    const files = await fs.readdir(testDir);
    expect(files.length).toBeGreaterThan(0);
    expect(files.some(f => f.startsWith('autosave-'))).toBe(true);
    
    const loaded = await interpreter.loadLatestState();
    expect(loaded).toBe(true);
  });
  
  test('getAutoSaveStatus returns correct information', () => {
    const status = interpreter.getAutoSaveStatus();
    
    expect(status).toHaveProperty('enabled');
    expect(status).toHaveProperty('initialized');
    expect(status).toHaveProperty('pendingChanges');
    expect(status).toHaveProperty('devinChangesSummary');
    expect(status.enabled).toBe(true);
  });
  
  test('exportDevinChanges handles empty changes', async () => {
    const exportPath = await interpreter.exportDevinChanges();
    expect(exportPath).toBeNull(); // No Devin changes to export
  });
  
  test('autosave handles disabled configuration', () => {
    const disabledInterpreter = new GoliathCognitiveInterpreter({
      autosave: { enabled: false }
    });
    
    const status = disabledInterpreter.getAutoSaveStatus();
    expect(status.enabled).toBe(false);
  });
  
  test('autosave system handles compression and checksums', async () => {
    const testEvent = {
      entityType: 'adult_male',
      entityId: 'test_002',
      location: 'test_zone',
      timestamp: Date.now(),
      behaviors: ['walking'],
      spatialData: { x: 1, y: 1 },
      detectionConfidence: 0.9
    };
    
    await interpreter.interpretEvent(testEvent);
    const savedPath = await interpreter.saveState();
    
    expect(savedPath.endsWith('.gz')).toBe(true);
    
    const checksumPath = `${savedPath}.checksum`;
    const checksumExists = await fs.access(checksumPath).then(() => true).catch(() => false);
    expect(checksumExists).toBe(true);
  });
});
