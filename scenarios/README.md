# Scenario Testing Guide

This directory contains documentation and guidance for running comprehensive scenario tests for the Novin AI system.

## Overview

The scenario testing harness validates the Novin AI system across multiple dimensions:

1. **Behavior Classification Accuracy** - Tests the AI's ability to correctly classify security events
2. **AutoSave System Integrity** - Validates data persistence and corruption detection
3. **Performance Characteristics** - Measures processing latency and resource usage
4. **Integration Robustness** - Tests system behavior under various conditions

## Available Test Scenarios

### 1. Behavior Evaluation Scenario

**What it tests:**
- Event sequence interpretation accuracy
- Classification precision/recall across security threat categories
- Processing latency per event sequence
- Error handling for malformed events

**Script:** `scripts/evaluate_behavior.cjs`

**Sample dataset:** `data/sample_labeled_events.json`

The sample dataset includes 6 labeled scenarios covering:
- `benign`: Normal authorized activities
- `suspicious`: Potentially concerning but not immediately threatening
- `reconnaissance`: Information gathering activities
- `curious`: Exploratory behavior with uncertain intent
- `trespassing`: Clear unauthorized access attempts

**Pass/Fail Criteria:**
- ✅ **Pass**: Accuracy ≥ 70% and macro F1 ≥ 0.6
- ⚠️ **Warning**: Accuracy 50-70% or macro F1 0.4-0.6
- ❌ **Fail**: Accuracy < 50% or macro F1 < 0.4 or processing errors > 20%

### 2. AutoSave Roundtrip Scenario

**What it tests:**
- AutoSave system initialization and configuration
- Component registration and state tracking
- File persistence with compression and checksums
- Corruption detection via SHA256 validation
- Save/restore cycle integrity

**Script:** `scripts/test_autosave_roundtrip.cjs`

**Test phases:**
1. AutoSave system loading and initialization
2. Mock component registration
3. Forced save operation
4. File verification and checksum calculation
5. Corruption injection and detection
6. Restore functionality (best effort)

**Pass/Fail Criteria:**
- ✅ **Pass**: All phases complete successfully, checksums detect corruption
- ⚠️ **Warning**: Restore fails but other phases pass (restore is optional)
- ❌ **Fail**: Any critical phase fails (loading, saving, checksum detection)

## Running Scenarios Locally

### Prerequisites

1. Node.js 18.x or higher
2. All project dependencies installed (`npm install`)
3. Access to the main AI interpreter module

### Quick Start

```bash
# Run all scenario tests
npm run scenario:evaluate
npm run scenario:autosave

# Or run individual scripts with verbose output
node scripts/evaluate_behavior.cjs --verbose
node scripts/test_autosave_roundtrip.cjs --verbose
```

### Custom Datasets

To test with your own labeled dataset:

1. Create a JSON file following the sample format in `data/sample_labeled_events.json`
2. Each entry must have: `id`, `label`, `events[]`, and `description`
3. Events must include: `entityType`, `entityId`, `location`, `timestamp`, `behaviors[]`, `spatialData`, `detectionConfidence`

```bash
node scripts/evaluate_behavior.cjs --dataset path/to/your/dataset.json
```

### Development Testing

For development and debugging:

```bash
# Keep test files for inspection
node scripts/test_autosave_roundtrip.cjs --no-cleanup --verbose

# Test with specific save directory
node scripts/test_autosave_roundtrip.cjs --save-dir ./debug-saves
```

## Running Scenarios in CI

### GitHub Actions Integration

The scenarios are integrated into the CI pipeline via `.github/workflows/comprehensive-scenarios.yml`:

- Triggered on: Pull requests, manual dispatch
- Node.js version: 18.x
- Artifacts: Evaluation results, autosave logs
- Failure conditions: Script exit codes ≠ 0

### CI Execution Steps

1. Environment setup (Node 18.x, dependencies)
2. Run existing test suite (`npm test`)
3. Execute behavior evaluation with sample dataset
4. Execute autosave roundtrip test
5. Collect and upload artifacts
6. Report pass/fail status

### Artifact Collection

CI automatically collects:
- `evaluation_results.json` - Behavior classification metrics
- `autosave_test_results.json` - AutoSave system test results
- Console logs from both test runs

## Adding New Scenarios

### Guidelines for New Test Scenarios

1. **Follow the CommonJS pattern** - Use `require`/`module.exports` for compatibility
2. **Provide CLI interface** - Include argument parsing and help text
3. **Use deterministic outputs** - Sort JSON keys for consistent checksums
4. **Include comprehensive logging** - Support verbose mode for debugging
5. **Proper exit codes** - 0 for success, 1 for failure
6. **Error tolerance** - Handle missing dependencies gracefully

### New Dataset Format

When creating new labeled datasets:

```json
[
  {
    "id": "unique_identifier",
    "label": "expected_classification",
    "events": [
      {
        "entityType": "type_of_entity",
        "entityId": "unique_entity_id", 
        "location": "spatial_location",
        "timestamp": 1640995200000,
        "behaviors": ["list", "of", "behaviors"],
        "spatialData": { "x": 0, "y": 0 },
        "detectionConfidence": 0.95
      }
    ],
    "description": "Human readable description"
  }
]
```

### Integration Steps

1. Add new script to `scripts/` directory
2. Update `scripts/README.md` with documentation
3. Add npm script to `package.json` if needed
4. Update CI workflow to include new scenario
5. Document expected pass/fail criteria
6. Test locally before PR submission

## Troubleshooting

### Common Issues

**"Cannot use import statement outside a module"**
- Ensure scripts use CommonJS syntax (`require`/`module.exports`)
- Check that modules are loaded with proper dynamic imports

**"AutoSaveSystem not found"**
- Verify `autosave-system.js` exists in project root
- Check file permissions and accessibility

**"Accuracy too low" / Test failures**
- Review sample dataset for quality issues
- Check interpreter configuration and initialization
- Verify event format matches expected schema

**CI artifacts not uploading**
- Ensure output files are created in workspace root
- Check file permissions and naming conventions
- Verify workflow artifact collection paths

### Debugging Tips

1. Use `--verbose` flag for detailed logging
2. Use `--no-cleanup` to inspect intermediate files
3. Check console output for specific error messages
4. Verify file permissions in save directories
5. Test individual components before integration

## Performance Expectations

### Typical Performance Baselines

- **Behavior evaluation**: ~50-200ms per event sequence
- **AutoSave operations**: ~10-50ms for small components
- **File I/O**: <10ms for test-sized datasets
- **Checksum calculation**: <5ms for typical save files

### Performance Monitoring

The scenarios automatically collect timing data:
- Processing time per event sequence
- Save/restore operation latency
- File I/O timing
- Overall test execution time

This data is included in the JSON output for trend analysis and performance regression detection.