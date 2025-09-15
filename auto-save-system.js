/**
 * Auto-Save System
 * 
 * Provides automatic saving and persistence capabilities for the MobileNovin AI system.
 * Tracks changes, manages save intervals, and handles recovery of unsaved data.
 * 
 * @version 1.0.0
 * @author Cognitive Systems Team
 */

import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

class AutoSaveSystem {
  constructor(config = {}) {
    this.config = {
      autoSaveEnabled: config.autoSaveEnabled !== false, // Default enabled
      saveInterval: config.saveInterval || 30000, // 30 seconds default
      saveDirectory: config.saveDirectory || './data/auto-saves',
      maxBackups: config.maxBackups || 10,
      compressionEnabled: config.compressionEnabled !== false,
      devinTrackingEnabled: config.devinTrackingEnabled !== false,
      ...config
    };
    
    // State tracking
    this.pendingChanges = new Set();
    this.lastSaveTime = Date.now();
    this.saveHistory = [];
    this.devinChanges = new Map(); // Track AI-generated changes
    
    // Auto-save timer
    this.saveTimer = null;
    this.isShuttingDown = false;
    
    // Change detection
    this.changeListeners = new Map();
    this.lastSnapshots = new Map();
    
    console.log('💾 Auto-Save System initialized');
    this._initializeDirectories();
    this._startAutoSave();
  }

  /**
   * Initialize save directories
   */
  async _initializeDirectories() {
    try {
      await fs.mkdir(this.config.saveDirectory, { recursive: true });
      await fs.mkdir(path.join(this.config.saveDirectory, 'backups'), { recursive: true });
      await fs.mkdir(path.join(this.config.saveDirectory, 'devin-changes'), { recursive: true });
    } catch (error) {
      console.warn('Failed to initialize save directories:', error.message);
    }
  }

  /**
   * Start the auto-save timer
   */
  _startAutoSave() {
    if (!this.config.autoSaveEnabled) return;
    
    this.saveTimer = setInterval(() => {
      this._performAutoSave().catch(error => {
        console.error('Auto-save failed:', error);
      });
    }, this.config.saveInterval);
  }

  /**
   * Register a component for auto-saving
   * @param {string} componentId - Unique identifier for the component
   * @param {Object} component - Component instance with getSaveState() method
   */
  registerComponent(componentId, component) {
    if (!component || typeof component.getSaveState !== 'function') {
      throw new Error('Component must implement getSaveState() method');
    }
    
    this.changeListeners.set(componentId, component);
    console.log(`📝 Registered component for auto-save: ${componentId}`);
  }

  /**
   * Unregister a component from auto-saving
   * @param {string} componentId - Component identifier
   */
  unregisterComponent(componentId) {
    this.changeListeners.delete(componentId);
    this.lastSnapshots.delete(componentId);
    this.pendingChanges.delete(componentId);
  }

  /**
   * Mark a component as having pending changes
   * @param {string} componentId - Component identifier
   * @param {Object} changeDetails - Optional details about the change
   */
  markChanged(componentId, changeDetails = {}) {
    this.pendingChanges.add(componentId);
    
    // Track if this is a "devin change" (AI-generated)
    if (changeDetails.isDevinChange || changeDetails.source === 'ai' || changeDetails.source === 'devin') {
      this._trackDevinChange(componentId, changeDetails);
    }
  }

  /**
   * Track AI-generated (devin) changes separately
   * @param {string} componentId - Component identifier
   * @param {Object} changeDetails - Change details
   */
  _trackDevinChange(componentId, changeDetails) {
    if (!this.config.devinTrackingEnabled) return;
    
    const changeId = `${componentId}-${Date.now()}`;
    const change = {
      componentId,
      timestamp: Date.now(),
      details: changeDetails,
      saved: false,
      telemetry: {
        changeSize: JSON.stringify(changeDetails).length,
        changeType: changeDetails.type || 'unknown',
        confidenceLevel: changeDetails.confidence || 'unknown'
      }
    };
    
    this.devinChanges.set(changeId, change);
    
    console.log(`🤖 Tracked Devin change: ${changeId} (${change.telemetry.changeType}, ${(change.telemetry.changeSize / 1024).toFixed(2)}KB)`);
    
    // Add validation logging
    this._validateDevinChange(change);
  }

  /**
   * Perform auto-save for all registered components
   */
  async _performAutoSave() {
    if (this.isShuttingDown || this.pendingChanges.size === 0) {
      return;
    }

    const saveId = `autosave-${Date.now()}`;
    const saveData = {
      id: saveId,
      timestamp: Date.now(),
      components: {},
      devinChanges: [],
      metadata: {
        version: '1.0.0',
        aiGeneratedChanges: this._getUnsavedDevinChanges().length
      }
    };

    try {
      // Collect state from all components with pending changes
      for (const componentId of this.pendingChanges) {
        const component = this.changeListeners.get(componentId);
        if (component) {
          try {
            const state = await component.getSaveState();
            saveData.components[componentId] = {
              state,
              lastModified: Date.now(),
              checksum: this._calculateChecksum(state)
            };
          } catch (error) {
            console.warn(`Failed to get save state for ${componentId}:`, error.message);
          }
        }
      }

      // Include unsaved devin changes
      saveData.devinChanges = this._getUnsavedDevinChanges();
      
      // Add telemetry data
      saveData.telemetry = {
        saveId,
        componentCount: Object.keys(saveData.components).length,
        devinChangesCount: saveData.devinChanges.length,
        saveSize: JSON.stringify(saveData).length,
        compressionEnabled: this.config.compressionEnabled,
        saveTime: Date.now()
      };

      // Write save file
      const saveFile = path.join(this.config.saveDirectory, `${saveId}.json`);
      await this._writeSaveFile(saveFile, saveData);

      // Log telemetry
      console.log(`💾 Auto-save completed: ${saveData.telemetry.componentCount} components, ${saveData.telemetry.devinChangesCount} Devin changes, ${(saveData.telemetry.saveSize / 1024).toFixed(2)}KB`);

      // Update state
      this.lastSaveTime = Date.now();
      this.pendingChanges.clear();
      this._markDevinChangesSaved();
      
      // Manage backup history
      this._manageSaveHistory(saveId);

      console.log(`💾 Auto-save completed: ${saveId} (${Object.keys(saveData.components).length} components)`);

    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
    }
  }

  /**
   * Get all unsaved devin changes
   */
  _getUnsavedDevinChanges() {
    return Array.from(this.devinChanges.values()).filter(change => !change.saved);
  }

  /**
   * Mark devin changes as saved
   */
  _markDevinChangesSaved() {
    for (const change of this.devinChanges.values()) {
      change.saved = true;
    }
  }

  /**
   * Write save file with optional compression
   */
  async _writeSaveFile(filePath, data) {
    try {
      const jsonData = JSON.stringify(data, null, this.config.compressionEnabled ? 0 : 2);
      
      if (this.config.compressionEnabled) {
        const compressed = await gzipAsync(Buffer.from(jsonData, 'utf8'));
        await fs.writeFile(filePath + '.gz', compressed);
      } else {
        await fs.writeFile(filePath, jsonData);
      }
    } catch (error) {
      console.error('Failed to write save file:', error);
      throw error;
    }
  }

  /**
   * Production-grade compression using gzip
   */
  async _compressData(data) {
    try {
      return await gzipAsync(Buffer.from(data, 'utf8'));
    } catch (error) {
      console.warn('Compression failed, using uncompressed data:', error);
      return Buffer.from(data, 'utf8');
    }
  }

  /**
   * Calculate SHA-256 checksum for data integrity
   */
  _calculateChecksum(data) {
    try {
      // Create canonical JSON to ensure consistent hashing
      const canonicalJson = JSON.stringify(data, Object.keys(data).sort());
      return createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
    } catch (error) {
      console.warn('Checksum calculation failed:', error);
      return 'checksum-error-' + Date.now();
    }
  }

  /**
   * Validate Devin changes for integrity and completeness
   */
  _validateDevinChange(change) {
    const issues = [];
    
    // Check required fields
    if (!change.componentId) issues.push('Missing componentId');
    if (!change.details) issues.push('Missing details');
    if (!change.timestamp) issues.push('Missing timestamp');
    
    // Check data integrity
    if (change.details) {
      if (typeof change.details !== 'object') issues.push('Details must be an object');
      if (change.telemetry?.changeSize > 1024 * 1024) issues.push('Change size exceeds 1MB limit');
    }
    
    // Log validation results
    if (issues.length > 0) {
      console.warn(`⚠️  Devin change validation issues: ${issues.join(', ')}`);
    } else {
      console.log(`✅ Devin change validated successfully`);
    }
    
    return issues.length === 0;
  }

  /**
   * Manage save history and cleanup old backups
   */
  _manageSaveHistory(saveId) {
    this.saveHistory.push({
      id: saveId,
      timestamp: Date.now()
    });

    // Cleanup old saves
    if (this.saveHistory.length > this.config.maxBackups) {
      const oldSaves = this.saveHistory.splice(0, this.saveHistory.length - this.config.maxBackups);
      this._cleanupOldSaves(oldSaves);
    }
  }

  /**
   * Cleanup old save files
   */
  async _cleanupOldSaves(oldSaves) {
    for (const save of oldSaves) {
      try {
        const saveFile = path.join(this.config.saveDirectory, `${save.id}.json`);
        const compressedFile = saveFile + '.compressed';
        
        await fs.unlink(saveFile).catch(() => {}); // Ignore if file doesn't exist
        await fs.unlink(compressedFile).catch(() => {}); // Ignore if file doesn't exist
      } catch (error) {
        console.warn(`Failed to cleanup old save ${save.id}:`, error.message);
      }
    }
  }

  /**
   * Force immediate save
   */
  async forceSave() {
    console.log('💾 Forcing immediate save...');
    await this._performAutoSave();
  }

  /**
   * Load latest save file
   */
  async loadLatestSave() {
    try {
      const saveFiles = await fs.readdir(this.config.saveDirectory);
      const autoSaveFiles = saveFiles
        .filter(file => file.startsWith('autosave-') && file.endsWith('.json'))
        .sort()
        .reverse();

      if (autoSaveFiles.length === 0) {
        console.log('📂 No auto-save files found');
        return null;
      }

      const latestFile = path.join(this.config.saveDirectory, autoSaveFiles[0]);
      const saveData = JSON.parse(await fs.readFile(latestFile, 'utf8'));
      
      console.log(`📂 Loaded latest save: ${saveData.id}`);
      return saveData;

    } catch (error) {
      console.error('Failed to load latest save:', error);
      return null;
    }
  }

  /**
   * Restore state to registered components
   */
  async restoreFromSave(saveData) {
    if (!saveData || !saveData.components) {
      throw new Error('Invalid save data');
    }

    let restoredCount = 0;
    
    for (const [componentId, componentData] of Object.entries(saveData.components)) {
      const component = this.changeListeners.get(componentId);
      if (component && typeof component.restoreFromSave === 'function') {
        try {
          await component.restoreFromSave(componentData.state);
          restoredCount++;
        } catch (error) {
          console.warn(`Failed to restore ${componentId}:`, error.message);
        }
      }
    }

    console.log(`📂 Restored ${restoredCount} components from save`);
    return restoredCount;
  }

  /**
   * Get devin changes summary
   */
  getDevinChangesSummary() {
    const changes = Array.from(this.devinChanges.values());
    return {
      total: changes.length,
      unsaved: changes.filter(c => !c.saved).length,
      byComponent: this._groupBy(changes, 'componentId'),
      recent: changes.filter(c => Date.now() - c.timestamp < 3600000) // Last hour
    };
  }

  /**
   * Export devin changes to file
   */
  async exportDevinChanges() {
    const changes = Array.from(this.devinChanges.values());
    const exportData = {
      exportTime: Date.now(),
      totalChanges: changes.length,
      changes: changes
    };

    const exportFile = path.join(
      this.config.saveDirectory, 
      'devin-changes', 
      `devin-export-${Date.now()}.json`
    );

    await fs.writeFile(exportFile, JSON.stringify(exportData, null, 2));
    console.log(`🤖 Exported ${changes.length} Devin changes to: ${exportFile}`);
    
    return exportFile;
  }

  /**
   * Utility function to group array by property
   */
  _groupBy(array, property) {
    return array.reduce((groups, item) => {
      const key = item[property];
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {});
  }

  /**
   * Get auto-save status
   */
  getStatus() {
    return {
      enabled: this.config.autoSaveEnabled,
      interval: this.config.saveInterval,
      pendingChanges: this.pendingChanges.size,
      lastSaveTime: this.lastSaveTime,
      timeSinceLastSave: Date.now() - this.lastSaveTime,
      saveHistory: this.saveHistory.length,
      devinChanges: this.getDevinChangesSummary(),
      registeredComponents: Array.from(this.changeListeners.keys())
    };
  }

  /**
   * Shutdown auto-save system gracefully
   */
  async shutdown() {
    this.isShuttingDown = true;
    
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = null;
    }

    // Perform final save if there are pending changes
    if (this.pendingChanges.size > 0) {
      console.log('💾 Performing final save before shutdown...');
      await this._performAutoSave();
    }

    console.log('💾 Auto-Save System shutdown complete');
  }
}

export default AutoSaveSystem;