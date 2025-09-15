# Scripts Directory

This directory contains comprehensive scenario testing scripts for the Novin AI system.

## Available Scripts

### 1. evaluate_behavior.cjs

Loads a labeled dataset and evaluates the interpreter's behavior classification performance.

**Purpose:**
- Tests the `interpretEventSequence` method with real-world scenarios
- Computes precision/recall/F1 metrics per class
- Provides detailed performance analysis

**Usage:**
```bash
# Basic usage with default dataset
node scripts/evaluate_behavior.cjs

# Verbose mode with custom dataset
node scripts/evaluate_behavior.cjs --dataset custom_data.json --verbose

# Custom output location
node scripts/evaluate_behavior.cjs --output results/eval.json
```

**Options:**
- `--dataset <path>`: Path to labeled dataset (default: data/sample_labeled_events.json)
- `--output <path>`: Output file for results (default: evaluation_results.json)
- `--interpreter <path>`: Path to interpreter module (default: auto-detect)
- `--verbose`: Enable detailed logging
- `--help`: Show help message

**Exit Codes:**
- `0`: Success, all tests passed
- `1`: Errors encountered during evaluation

### 2. test_autosave_roundtrip.cjs

Tests the AutoSave system's complete save/restore cycle including corruption detection.

**Purpose:**
- Validates AutoSave system integration
- Tests file integrity via SHA256 checksums
- Verifies corruption detection capabilities
- Ensures proper save/restore functionality

**Usage:**
```bash
# Basic roundtrip test
node scripts/test_autosave_roundtrip.cjs

# Verbose mode without cleanup
node scripts/test_autosave_roundtrip.cjs --verbose --no-cleanup

# Custom test directory
node scripts/test_autosave_roundtrip.cjs --save-dir ./custom-test
```

**Options:**
- `--save-dir <path>`: Save directory for test (default: ./test-autosave)
- `--component <name>`: Mock component name (default: test-component)
- `--no-cleanup`: Skip cleanup of test files
- `--verbose`: Enable detailed logging
- `--help`: Show help message

**Exit Codes:**
- `0`: Success, all phases passed
- `1`: One or more test phases failed

## Requirements

Both scripts are written in CommonJS format to avoid ES module compatibility issues. They use only built-in Node.js modules:

- `fs/promises` for file operations
- `crypto` for SHA256 checksums
- `path` for path manipulation

## Integration with npm scripts

These scripts can be run via npm scripts defined in package.json:

```bash
npm run scenario:evaluate
npm run scenario:autosave
```

## CI/CD Integration

These scripts are designed to work in CI environments and provide:

- Clear exit codes for pass/fail determination
- JSON output for artifact collection
- Verbose logging for debugging
- Deterministic behavior for reproducible results

## Adding New Scripts

When adding new scenario scripts:

1. Use CommonJS format (`require`/`module.exports`)
2. Include comprehensive CLI argument parsing
3. Provide verbose logging options
4. Use deterministic JSON serialization for output
5. Include proper error handling and exit codes
6. Document usage and examples in this README