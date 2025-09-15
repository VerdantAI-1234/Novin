# Auto-Save System for MobileNovin AI

## Overview

The Auto-Save System provides automatic persistence and recovery capabilities for the MobileNovin AI cognitive interpreter. It automatically saves the AI's learning state, memory contents, and tracks AI-generated changes ("Devin changes") for recovery and analysis.

## Features

### 🔄 Automatic State Persistence
- **Configurable intervals**: Default 30-second auto-save
- **Memory-aware**: Tracks contextual memory, adaptive learning state
- **Performance metrics**: Saves processing statistics
- **Incremental saves**: Only saves when changes are detected

### 🤖 Devin Change Tracking
- **AI-generated change detection**: Tracks when AI makes assessments
- **Source attribution**: Distinguishes between user and AI changes
- **Export capabilities**: Generate reports of AI modifications
- **Recovery support**: Restore AI state after system restarts

### 💾 Data Management
- **Configurable retention**: Control number of backup files
- **Compression support**: Optional data compression
- **Integrity checking**: Checksums for data validation
- **Graceful shutdown**: Ensures final save before exit

## Configuration

```javascript
const ai = new GoliathCognitiveInterpreter({
  // Auto-save configuration
  autoSaveEnabled: true,                    // Enable/disable auto-save
  autoSaveInterval: 30000,                  // Save interval in milliseconds
  autoSaveDirectory: './data/auto-saves',   // Save directory
  maxAutoSaveBackups: 10,                   // Maximum backup files to keep
  devinTrackingEnabled: true,               // Track AI-generated changes
  
  // Advanced options
  autoSaveConfig: {
    compressionEnabled: true,               // Enable data compression
    maxBackups: 15,                        // Override max backups
    saveDirectory: './custom-saves'        // Custom save location
  }
});
```

## Usage

### Basic Operations

```javascript
// Check auto-save status
const status = ai.getAutoSaveStatus();
console.log('Auto-save enabled:', status.enabled);
console.log('Pending changes:', status.pendingChanges);
console.log('Time since last save:', status.timeSinceLastSave);

// Force immediate save
await ai.saveState();

// Load latest saved state
const loaded = await ai.loadLatestState();
```

### Devin Changes Management

```javascript
// Get summary of AI-generated changes
const devinSummary = ai.getAutoSaveStatus().devinChangesSummary;
console.log('Total AI changes:', devinSummary.total);
console.log('Unsaved changes:', devinSummary.unsaved);

// Export AI changes to file
const exportFile = await ai.exportDevinChanges();
console.log('AI changes exported to:', exportFile);
```

### Manual Change Tracking

```javascript
// Manually mark a change as AI-generated
ai._markChanged({
  type: 'manual_adjustment',
  source: 'devin',           // or 'ai'
  isAiGenerated: true,
  description: 'Model parameter adjustment',
  timestamp: Date.now()
});
```

## File Structure

```
data/auto-saves/
├── autosave-1672531200000.json        # Timestamped save files
├── autosave-1672531230000.json
├── backups/                           # Older backups
│   └── autosave-1672530900000.json
└── devin-changes/                     # AI change exports
    └── devin-export-1672531250000.json
```

## Save File Format

```json
{
  "id": "autosave-1672531200000",
  "timestamp": 1672531200000,
  "metadata": {
    "version": "1.0.0",
    "aiGeneratedChanges": 5
  },
  "components": {
    "contextual-memory": {
      "state": { /* memory state */ },
      "lastModified": 1672531200000,
      "checksum": "abc123"
    },
    "adaptive-learning": {
      "state": { /* learning state */ },
      "lastModified": 1672531200000,
      "checksum": "def456"
    },
    "main-ai-system": {
      "state": { /* main system state */ },
      "lastModified": 1672531200000,
      "checksum": "ghi789"
    }
  },
  "devinChanges": [
    {
      "componentId": "main-ai-system",
      "timestamp": 1672531195000,
      "details": {
        "type": "event_interpreted",
        "eventId": "evt-123",
        "isAiGenerated": true,
        "source": "ai"
      },
      "saved": true
    }
  ]
}
```

## API Reference

### Auto-Save System Methods

#### `registerComponent(componentId, component)`
Register a component for auto-saving. Component must implement:
- `getSaveState()` - Return serializable state
- `restoreFromSave(state)` - Restore from saved state

#### `markChanged(componentId, changeDetails)`
Mark a component as having changes requiring save.

#### `forceSave()`
Immediately perform save operation.

#### `loadLatestSave()`
Load and return the most recent save file.

#### `getStatus()`
Get current auto-save system status and statistics.

#### `exportDevinChanges()`
Export all AI-generated changes to a JSON file.

#### `shutdown()`
Gracefully shutdown auto-save system with final save.

### AI System Integration Methods

#### `ai.saveState()`
Force immediate save of all registered components.

#### `ai.loadLatestState()`
Load latest auto-save file and restore system state.

#### `ai.getAutoSaveStatus()`
Get comprehensive auto-save status including Devin changes.

#### `ai.exportDevinChanges()`
Export AI-generated changes to timestamped file.

## Implementation Details

### Change Detection
The system detects changes through:
1. **Event processing**: AI assessments trigger auto-save
2. **Memory updates**: New memories mark system as changed
3. **Learning updates**: Adaptive learning changes trigger saves
4. **Manual marking**: Explicit change notifications

### Performance Considerations
- **Minimal overhead**: Change detection has negligible performance impact
- **Batched saves**: Multiple changes batched into single save operation
- **Background processing**: Save operations don't block AI processing
- **Memory efficient**: Only saves changed components

### Error Handling
- **Graceful degradation**: System continues if auto-save fails
- **Retry logic**: Failed saves are retried on next interval
- **Corruption protection**: Checksums prevent loading corrupted data
- **Partial recovery**: Individual components can fail to restore without breaking system

## Best Practices

1. **Configure appropriate intervals**: Balance between safety and performance
2. **Monitor disk space**: Auto-saves accumulate over time
3. **Regular cleanup**: Remove old save files periodically
4. **Test recovery**: Verify restore functionality in development
5. **Backup externally**: Auto-saves are local backups, not replacements for external backup

## Troubleshooting

### Common Issues

**Auto-save not working:**
- Check `autoSaveEnabled` configuration
- Verify directory permissions
- Check console for error messages

**High disk usage:**
- Reduce `maxAutoSaveBackups`
- Enable compression
- Implement external cleanup

**Slow performance:**
- Increase `autoSaveInterval`
- Disable detailed change tracking
- Use selective component registration

**Recovery failures:**
- Check save file integrity
- Verify component compatibility
- Review error logs for specific failures

### Debug Information

```javascript
// Get detailed status for debugging
const status = ai.getAutoSaveStatus();
console.log('Registered components:', status.registeredComponents);
console.log('Save history:', status.saveHistory);
console.log('Last save time:', new Date(status.lastSaveTime));
```