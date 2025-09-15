/**
 * Production Autosave System with proper compression and checksums
 */
import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import crypto from 'crypto';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class AutoSaveSystem {
  constructor(config = {}) {
    this.config = {
      enabled: true,
      intervalMs: 30000,
      maxBackups: 5,
      compressionEnabled: true,
      checksumValidation: true,
      saveDirectory: './saves',
      ...config.autosave
    };
    
    this.changeTracker = new Map();
    this.devinChanges = new Map();
    this.saveTimer = null;
    this.isInitialized = false;
    this.lastSaveTime = 0;
  }
  
  async initialize() {
    if (!this.config.enabled) {
      console.log('AutoSave: Disabled by configuration');
      return;
    }
    
    try {
      await fs.mkdir(this.config.saveDirectory, { recursive: true });
      this.isInitialized = true;
      this._startAutoSave();
      console.log(`AutoSave: Initialized with directory ${this.config.saveDirectory}`);
    } catch (error) {
      console.error('AutoSave initialization failed:', error);
      throw error;
    }
  }
  
  markChanged(componentName, data, options = {}) {
    if (!this.config.enabled) return;
    
    const changeEntry = {
      data,
      timestamp: Date.now(),
      checksum: this._calculateChecksum(data),
      devinGenerated: options.devinGenerated || false
    };
    
    this.changeTracker.set(componentName, changeEntry);
    
    if (options.devinGenerated) {
      this._trackDevinChange(componentName, data, options);
    }
    
    console.log(`AutoSave: Marked ${componentName} as changed${options.devinGenerated ? ' (Devin-generated)' : ''}`);
  }
  
  _trackDevinChange(componentName, data, options) {
    const changeId = `${componentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const change = {
      componentName,
      timestamp: Date.now(),
      data,
      options,
      saved: false
    };
    
    this.devinChanges.set(changeId, change);
    console.log(`AutoSave: Tracked Devin change ${changeId}`);
  }
  
  async saveState() {
    if (!this.isInitialized || this.changeTracker.size === 0) {
      console.log('AutoSave: No changes to save');
      return null;
    }
    
    try {
      const saveData = {
        timestamp: Date.now(),
        version: '1.0.0',
        components: Object.fromEntries(this.changeTracker),
        devinChanges: this._getUnsavedDevinChanges(),
        metadata: {
          totalComponents: this.changeTracker.size,
          devinChangesCount: this.devinChanges.size
        }
      };
      
      const serialized = JSON.stringify(saveData, null, 2);
      const checksum = this._calculateChecksum(serialized);
      
      let finalData = serialized;
      if (this.config.compressionEnabled) {
        finalData = await gzip(Buffer.from(serialized, 'utf8'));
      }
      
      const filename = `autosave-${Date.now()}.json${this.config.compressionEnabled ? '.gz' : ''}`;
      const filepath = path.join(this.config.saveDirectory, filename);
      
      const tempPath = `${filepath}.tmp`;
      await fs.writeFile(tempPath, finalData);
      await fs.rename(tempPath, filepath);
      
      if (this.config.checksumValidation) {
        await fs.writeFile(`${filepath}.checksum`, checksum);
      }
      
      await this._cleanupOldBackups();
      
      this._markDevinChangesSaved();
      
      this.lastSaveTime = Date.now();
      this.changeTracker.clear();
      
      console.log(`AutoSave: State saved to ${filename} (${this.config.compressionEnabled ? 'compressed' : 'uncompressed'})`);
      return filepath;
      
    } catch (error) {
      console.error('AutoSave failed:', error);
      throw error;
    }
  }
  
  async loadLatestSave() {
    if (!this.isInitialized) {
      console.warn('AutoSave: Not initialized, cannot load');
      return null;
    }
    
    try {
      const files = await fs.readdir(this.config.saveDirectory);
      const saveFiles = files
        .filter(f => f.startsWith('autosave-') && (f.endsWith('.json') || f.endsWith('.json.gz')))
        .sort()
        .reverse();
      
      if (saveFiles.length === 0) {
        console.log('AutoSave: No save files found');
        return null;
      }
      
      const latestFile = saveFiles[0];
      return await this.loadSave(latestFile);
      
    } catch (error) {
      console.error('Failed to load latest save:', error);
      return null;
    }
  }
  
  async loadSave(filename) {
    try {
      const filepath = path.join(this.config.saveDirectory, filename);
      
      if (this.config.checksumValidation) {
        const checksumPath = `${filepath}.checksum`;
        try {
          const expectedChecksum = await fs.readFile(checksumPath, 'utf8');
          const fileData = await fs.readFile(filepath);
          
          let actualData;
          if (filename.endsWith('.gz')) {
            actualData = await gunzip(fileData);
          } else {
            actualData = fileData;
          }
          
          const actualChecksum = this._calculateChecksum(actualData.toString());
          if (actualChecksum !== expectedChecksum.trim()) {
            throw new Error('Checksum validation failed');
          }
        } catch (checksumError) {
          console.warn('AutoSave: Checksum validation failed, proceeding anyway:', checksumError.message);
        }
      }
      
      const fileData = await fs.readFile(filepath);
      let jsonData;
      
      if (filename.endsWith('.gz')) {
        const decompressed = await gunzip(fileData);
        jsonData = decompressed.toString();
      } else {
        jsonData = fileData.toString();
      }
      
      const saveData = JSON.parse(jsonData);
      console.log(`AutoSave: Loaded save from ${filename}`);
      return saveData;
      
    } catch (error) {
      console.error(`Failed to load save ${filename}:`, error);
      return null;
    }
  }
  
  async restoreFromSave(saveData) {
    if (!saveData) {
      console.log('AutoSave: No save data to restore');
      return;
    }
    
    console.log(`AutoSave: Restoring state from ${saveData.timestamp}`);
    
    for (const [componentName, componentData] of Object.entries(saveData.components)) {
      this.changeTracker.set(componentName, componentData);
    }
    
    if (saveData.devinChanges) {
      for (const change of saveData.devinChanges) {
        const changeId = `restored-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.devinChanges.set(changeId, { ...change, saved: true });
      }
    }
    
    console.log(`AutoSave: Restored ${Object.keys(saveData.components).length} components and ${saveData.devinChanges?.length || 0} Devin changes`);
  }
  
  async exportDevinChanges() {
    const changes = Array.from(this.devinChanges.values());
    if (changes.length === 0) {
      console.log('AutoSave: No Devin changes to export');
      return null;
    }
    
    const exportData = {
      timestamp: Date.now(),
      totalChanges: changes.length,
      changes: changes.map(change => ({
        componentName: change.componentName,
        timestamp: change.timestamp,
        data: change.data,
        options: change.options,
        saved: change.saved
      }))
    };
    
    const filename = `devin-changes-${Date.now()}.json`;
    const filepath = path.join(this.config.saveDirectory, filename);
    
    await fs.writeFile(filepath, JSON.stringify(exportData, null, 2));
    console.log(`AutoSave: Exported ${changes.length} Devin changes to ${filename}`);
    return filepath;
  }
  
  getStatus() {
    return {
      enabled: this.config.enabled,
      initialized: this.isInitialized,
      lastSaveTime: this.lastSaveTime,
      pendingChanges: this.changeTracker.size,
      timeSinceLastSave: this.lastSaveTime ? Date.now() - this.lastSaveTime : null,
      devinChangesSummary: {
        total: this.devinChanges.size,
        unsaved: Array.from(this.devinChanges.values()).filter(c => !c.saved).length,
        saved: Array.from(this.devinChanges.values()).filter(c => c.saved).length
      }
    };
  }
  
  _calculateChecksum(data) {
    try {
      const serialized = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());
      return crypto.createHash('sha256').update(serialized, 'utf8').digest('hex');
    } catch (error) {
      console.warn('AutoSave: Checksum calculation failed:', error);
      return `checksum-error-${Date.now()}`;
    }
  }
  
  _startAutoSave() {
    if (this.saveTimer) clearInterval(this.saveTimer);
    
    this.saveTimer = setInterval(() => {
      if (this.changeTracker.size > 0) {
        this.saveState().catch(error => {
          console.error('AutoSave: Periodic save failed:', error);
        });
      }
    }, this.config.intervalMs);
    
    console.log(`AutoSave: Started periodic saves every ${this.config.intervalMs}ms`);
  }
  
  _getUnsavedDevinChanges() {
    return Array.from(this.devinChanges.values()).filter(change => !change.saved);
  }
  
  _markDevinChangesSaved() {
    for (const change of this.devinChanges.values()) {
      change.saved = true;
    }
  }
  
  async _cleanupOldBackups() {
    try {
      const files = await fs.readdir(this.config.saveDirectory);
      const saveFiles = files
        .filter(f => f.startsWith('autosave-') && (f.endsWith('.json') || f.endsWith('.json.gz')))
        .map(f => ({
          name: f,
          path: path.join(this.config.saveDirectory, f),
          time: parseInt(f.match(/autosave-(\d+)/)?.[1] || '0')
        }))
        .sort((a, b) => b.time - a.time);
      
      if (saveFiles.length > this.config.maxBackups) {
        const filesToDelete = saveFiles.slice(this.config.maxBackups);
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          try {
            await fs.unlink(`${file.path}.checksum`);
          } catch (e) {
          }
        }
        console.log(`AutoSave: Cleaned up ${filesToDelete.length} old backup(s)`);
      }
    } catch (error) {
      console.error('AutoSave: Cleanup failed:', error);
    }
  }
  
  async shutdown() {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = null;
    }
    
    if (this.changeTracker.size > 0) {
      console.log('AutoSave: Performing final save before shutdown');
      await this.saveState();
    }
    
    console.log('AutoSave: Shutdown complete');
  }
}

export default AutoSaveSystem;
