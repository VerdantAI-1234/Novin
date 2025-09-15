#!/usr/bin/env node
/**
 * Behavior Evaluation Script
 * 
 * Loads a labeled dataset, runs the interpreter's interpretEventSequence for each item,
 * computes precision/recall per class, and writes results to disk.
 * 
 * Usage: node scripts/evaluate_behavior.cjs [options]
 * 
 * Options:
 *   --dataset <path>     Path to labeled dataset (default: data/sample_labeled_events.json)
 *   --output <path>      Output file for results (default: evaluation_results.json)
 *   --interpreter <path> Path to interpreter module (default: auto-detect)
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
    dataset: 'data/sample_labeled_events.json',
    output: 'evaluation_results.json',
    interpreter: null,
    verbose: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dataset':
        options.dataset = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--interpreter':
        options.interpreter = args[++i];
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

// Auto-detect interpreter path
async function detectInterpreterPath(options) {
  if (options.interpreter) {
    return path.resolve(options.interpreter);
  }

  // Try common locations
  const candidates = [
    'mobilenovin-ai.js',
    './mobilenovin-ai.js',
    '../mobilenovin-ai.js',
    'src/mobilenovin-ai.js'
  ];

  for (const candidate of candidates) {
    try {
      const fullPath = path.resolve(candidate);
      await fs.access(fullPath);
      if (options.verbose) {
        console.log(`✓ Found interpreter at: ${fullPath}`);
      }
      return fullPath;
    } catch (error) {
      // Continue searching
    }
  }

  throw new Error('Could not auto-detect interpreter path. Use --interpreter option.');
}

// Load and validate dataset
async function loadDataset(datasetPath, options) {
  try {
    if (options.verbose) {
      console.log(`📁 Loading dataset from: ${datasetPath}`);
    }
    
    const content = await fs.readFile(datasetPath, 'utf8');
    const dataset = JSON.parse(content);
    
    if (!Array.isArray(dataset)) {
      throw new Error('Dataset must be an array of labeled events');
    }
    
    // Validate each entry
    for (const entry of dataset) {
      if (!entry.id || !entry.label || !entry.events) {
        throw new Error(`Invalid entry: ${JSON.stringify(entry)}`);
      }
      if (!Array.isArray(entry.events)) {
        throw new Error(`Events must be an array for entry: ${entry.id}`);
      }
    }
    
    if (options.verbose) {
      console.log(`✓ Loaded ${dataset.length} labeled events`);
    }
    
    return dataset;
  } catch (error) {
    throw new Error(`Failed to load dataset: ${error.message}`);
  }
}

// Dynamic import for ES modules (since this is CommonJS)
async function loadInterpreter(interpreterPath, options) {
  try {
    if (options.verbose) {
      console.log(`🧠 Loading interpreter from: ${interpreterPath}`);
    }
    
    // Use dynamic import to load ES module from CommonJS
    const module = await import('file://' + interpreterPath);
    const GoliathCognitiveInterpreter = module.GoliathCognitiveInterpreter || module.default;
    
    if (!GoliathCognitiveInterpreter) {
      throw new Error('GoliathCognitiveInterpreter not found in module exports');
    }
    
    // Create interpreter instance
    const interpreter = new GoliathCognitiveInterpreter({
      explainabilityLevel: 'minimal',
      performanceOptimized: true
    });
    
    if (options.verbose) {
      console.log('✓ Interpreter initialized successfully');
    }
    
    return interpreter;
  } catch (error) {
    throw new Error(`Failed to load interpreter: ${error.message}`);
  }
}

// Extract predicted label from assessment
function extractPredictedLabel(assessment) {
  if (!assessment || typeof assessment !== 'object') {
    return 'unknown';
  }
  
  // Look for intent information
  if (assessment.intent) {
    return assessment.intent;
  }
  
  // Look for suspicion level and map to labels
  if (typeof assessment.suspicionLevel === 'number') {
    if (assessment.suspicionLevel < 0.2) return 'benign';
    if (assessment.suspicionLevel < 0.4) return 'curious';
    if (assessment.suspicionLevel < 0.6) return 'suspicious';
    if (assessment.suspicionLevel < 0.8) return 'reconnaissance';
    return 'trespassing';
  }
  
  // Look for classification field
  if (assessment.classification) {
    return assessment.classification;
  }
  
  // Default fallback
  return 'unknown';
}

// Compute precision, recall, and F1 score per class
function computeMetrics(predictions, labels) {
  const classes = [...new Set([...predictions, ...labels])];
  const metrics = {};
  
  for (const cls of classes) {
    const tp = predictions.filter((pred, i) => pred === cls && labels[i] === cls).length;
    const fp = predictions.filter((pred, i) => pred === cls && labels[i] !== cls).length;
    const fn = predictions.filter((pred, i) => pred !== cls && labels[i] === cls).length;
    
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
    
    metrics[cls] = {
      precision: precision,
      recall: recall,
      f1: f1,
      support: labels.filter(label => label === cls).length,
      true_positives: tp,
      false_positives: fp,
      false_negatives: fn
    };
  }
  
  // Calculate macro averages
  const classes_with_support = classes.filter(cls => metrics[cls].support > 0);
  const macro_precision = classes_with_support.reduce((sum, cls) => sum + metrics[cls].precision, 0) / classes_with_support.length;
  const macro_recall = classes_with_support.reduce((sum, cls) => sum + metrics[cls].recall, 0) / classes_with_support.length;
  const macro_f1 = classes_with_support.reduce((sum, cls) => sum + metrics[cls].f1, 0) / classes_with_support.length;
  
  // Calculate overall accuracy
  const correct = predictions.filter((pred, i) => pred === labels[i]).length;
  const accuracy = correct / predictions.length;
  
  return {
    per_class: metrics,
    macro_average: {
      precision: macro_precision,
      recall: macro_recall,
      f1: macro_f1
    },
    accuracy: accuracy,
    total_samples: predictions.length
  };
}

// Main evaluation function
async function evaluateDataset(dataset, interpreter, options) {
  const results = [];
  const predictions = [];
  const labels = [];
  
  if (options.verbose) {
    console.log('🔍 Starting evaluation...');
  }
  
  for (let i = 0; i < dataset.length; i++) {
    const entry = dataset[i];
    
    if (options.verbose) {
      console.log(`Processing ${i + 1}/${dataset.length}: ${entry.id}`);
    }
    
    try {
      // Run interpreter on event sequence
      const startTime = Date.now();
      const assessment = await interpreter.interpretEventSequence(entry.events);
      const duration = Date.now() - startTime;
      
      // Extract predicted label
      const predicted = extractPredictedLabel(assessment);
      
      predictions.push(predicted);
      labels.push(entry.label);
      
      results.push({
        id: entry.id,
        expected_label: entry.label,
        predicted_label: predicted,
        assessment: assessment,
        processing_time_ms: duration,
        description: entry.description
      });
      
      if (options.verbose) {
        console.log(`  Expected: ${entry.label}, Predicted: ${predicted}, Time: ${duration}ms`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${entry.id}: ${error.message}`);
      
      predictions.push('error');
      labels.push(entry.label);
      
      results.push({
        id: entry.id,
        expected_label: entry.label,
        predicted_label: 'error',
        error: error.message,
        processing_time_ms: 0,
        description: entry.description
      });
    }
  }
  
  // Compute metrics
  const metrics = computeMetrics(predictions, labels);
  
  if (options.verbose) {
    console.log('📊 Evaluation completed');
    console.log(`Accuracy: ${(metrics.accuracy * 100).toFixed(2)}%`);
    console.log(`Macro F1: ${(metrics.macro_average.f1 * 100).toFixed(2)}%`);
  }
  
  return {
    timestamp: new Date().toISOString(),
    dataset_path: options.dataset,
    total_samples: dataset.length,
    metrics: metrics,
    detailed_results: results,
    summary: {
      accuracy: metrics.accuracy,
      macro_f1: metrics.macro_average.f1,
      errors: results.filter(r => r.predicted_label === 'error').length
    }
  };
}

// Write results to disk
async function writeResults(results, outputPath, options) {
  try {
    if (options.verbose) {
      console.log(`💾 Writing results to: ${outputPath}`);
    }
    
    // Create deterministic JSON with sorted keys
    const sortedResults = JSON.stringify(results, null, 2);
    await fs.writeFile(outputPath, sortedResults);
    
    // Calculate checksum
    const checksum = crypto.createHash('sha256').update(sortedResults).digest('hex');
    
    if (options.verbose) {
      console.log(`✓ Results written successfully`);
      console.log(`📋 Checksum: ${checksum}`);
    }
    
    return checksum;
  } catch (error) {
    throw new Error(`Failed to write results: ${error.message}`);
  }
}

// Show help message
function showHelp() {
  console.log(`
Behavior Evaluation Script

Usage: node scripts/evaluate_behavior.cjs [options]

Options:
  --dataset <path>     Path to labeled dataset (default: data/sample_labeled_events.json)
  --output <path>      Output file for results (default: evaluation_results.json)
  --interpreter <path> Path to interpreter module (default: auto-detect)
  --verbose            Enable verbose logging
  --help               Show this help message

Examples:
  node scripts/evaluate_behavior.cjs
  node scripts/evaluate_behavior.cjs --dataset custom_data.json --verbose
  node scripts/evaluate_behavior.cjs --output results/eval.json --interpreter ./custom-ai.js
`);
}

// Main execution
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    process.exit(0);
  }
  
  try {
    console.log('🚀 Starting behavior evaluation...');
    
    // Auto-detect interpreter path
    const interpreterPath = await detectInterpreterPath(options);
    
    // Load dataset
    const dataset = await loadDataset(options.dataset, options);
    
    // Load interpreter
    const interpreter = await loadInterpreter(interpreterPath, options);
    
    // Run evaluation
    const results = await evaluateDataset(dataset, interpreter, options);
    
    // Write results
    const checksum = await writeResults(results, options.output, options);
    
    // Final summary
    console.log('✅ Evaluation completed successfully!');
    console.log(`📊 Accuracy: ${(results.summary.accuracy * 100).toFixed(2)}%`);
    console.log(`📈 Macro F1: ${(results.summary.macro_f1 * 100).toFixed(2)}%`);
    console.log(`🔍 Processed: ${results.total_samples} samples`);
    console.log(`❌ Errors: ${results.summary.errors}`);
    console.log(`💾 Results: ${options.output}`);
    console.log(`🔐 Checksum: ${checksum.substring(0, 8)}...`);
    
    // Exit with appropriate code
    process.exit(results.summary.errors > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Evaluation failed:', error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  loadDataset,
  loadInterpreter,
  evaluateDataset,
  computeMetrics,
  extractPredictedLabel
};