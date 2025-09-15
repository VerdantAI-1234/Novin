/**
 * Goliath Cognitive Interpreter Performance Benchmark
 * Tests latency, memory usage, and cognitive processing efficiency
 */

const { GoliathCognitiveInterpreter } = require('../src/mobilenovin-ai');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

class CognitivePerformanceBenchmark {
  constructor() {
    this.interpreter = null;
    this.results = {
      latency: [],
      memory: [],
      cognitive: [],
      throughput: []
    };
    this.testData = this._generateTestData();
  }

  async runFullBenchmark() {
    console.log('🧠 Goliath Cognitive Interpreter Performance Benchmark');
    console.log('=' .repeat(60));
    
    // Initialize interpreter
    await this._initializeInterpreter();
    
    // Run benchmark suites
    await this._benchmarkLatency();
    await this._benchmarkMemoryUsage();
    await this._benchmarkCognitiveProcessing();
    await this._benchmarkThroughput();
    
    // Generate report
    this._generateReport();
    
    console.log('\n✅ Benchmark completed successfully!');
  }

  async _initializeInterpreter() {
    console.log('\n🔧 Initializing Cognitive Interpreter...');
    const startTime = performance.now();
    
    this.interpreter = new GoliathCognitiveInterpreter({
      edgeMode: true,
      performanceOptimized: true,
      memoryLimit: 128 * 1024 * 1024, // 128MB
      latencyTarget: 5 // 5ms
    });
    
    await this.interpreter.initialize();
    
    const initTime = performance.now() - startTime;
    console.log(`   Initialization time: ${initTime.toFixed(2)}ms`);
    
    // Warm up the interpreter
    console.log('   Warming up cognitive systems...');
    for (let i = 0; i < 10; i++) {
      await this.interpreter.processEvent(this.testData.warmupEvents[i % this.testData.warmupEvents.length]);
    }
    
    console.log('   ✅ Interpreter ready for benchmarking');
  }

  async _benchmarkLatency() {
    console.log('\n⚡ Latency Benchmark');
    console.log('-'.repeat(30));
    
    const iterations = 1000;
    const latencies = [];
    
    for (let i = 0; i < iterations; i++) {
      const event = this.testData.events[i % this.testData.events.length];
      
      const startTime = performance.now();
      await this.interpreter.processEvent(event);
      const endTime = performance.now();
      
      const latency = endTime - startTime;
      latencies.push(latency);
      
      if ((i + 1) % 100 === 0) {
        process.stdout.write(`\r   Progress: ${i + 1}/${iterations} events processed`);
      }
    }
    
    const stats = this._calculateStats(latencies);
    this.results.latency = stats;
    
    console.log(`\n   Average latency: ${stats.mean.toFixed(2)}ms`);
    console.log(`   Median latency: ${stats.median.toFixed(2)}ms`);
    console.log(`   95th percentile: ${stats.p95.toFixed(2)}ms`);
    console.log(`   99th percentile: ${stats.p99.toFixed(2)}ms`);
    console.log(`   Max latency: ${stats.max.toFixed(2)}ms`);
    
    const targetMet = stats.p95 <= 5.0;
    console.log(`   Target (<5ms p95): ${targetMet ? '✅ PASS' : '❌ FAIL'}`);
  }

  async _benchmarkMemoryUsage() {
    console.log('\n💾 Memory Usage Benchmark');
    console.log('-'.repeat(30));
    
    const initialMemory = process.memoryUsage();
    console.log(`   Initial memory: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    
    const memorySnapshots = [];
    const iterations = 500;
    
    for (let i = 0; i < iterations; i++) {
      const event = this.testData.complexEvents[i % this.testData.complexEvents.length];
      await this.interpreter.processEvent(event);
      
      if (i % 50 === 0) {
        const memory = process.memoryUsage();
        memorySnapshots.push({
          iteration: i,
          heapUsed: memory.heapUsed,
          heapTotal: memory.heapTotal,
          external: memory.external
        });
        
        process.stdout.write(`\r   Progress: ${i + 1}/${iterations} events, Memory: ${(memory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      }
    }
    
    const finalMemory = process.memoryUsage();
    const memoryGrowth = finalMemory.heapUsed - initialMemory.heapUsed;
    
    this.results.memory = {
      initial: initialMemory.heapUsed,
      final: finalMemory.heapUsed,
      growth: memoryGrowth,
      snapshots: memorySnapshots
    };
    
    console.log(`\n   Final memory: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Memory growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`);
    
    const memoryTarget = 128 * 1024 * 1024; // 128MB
    const memoryTargetMet = finalMemory.heapUsed <= memoryTarget;
    console.log(`   Target (<128MB): ${memoryTargetMet ? '✅ PASS' : '❌ FAIL'}`);
  }

  async _benchmarkCognitiveProcessing() {
    console.log('\n🧠 Cognitive Processing Benchmark');
    console.log('-'.repeat(40));
    
    const cognitiveMetrics = {
      reasoning: [],
      memory: [],
      intent: [],
      explanation: []
    };
    
    const iterations = 200;
    
    for (let i = 0; i < iterations; i++) {
      const event = this.testData.cognitiveEvents[i % this.testData.cognitiveEvents.length];
      
      const startTime = performance.now();
      const result = await this.interpreter.processEvent(event);
      const totalTime = performance.now() - startTime;
      
      // Extract cognitive processing times
      if (result.processingBreakdown) {
        cognitiveMetrics.reasoning.push(result.processingBreakdown.reasoning || 0);
        cognitiveMetrics.memory.push(result.processingBreakdown.memory || 0);
        cognitiveMetrics.intent.push(result.processingBreakdown.intent || 0);
        cognitiveMetrics.explanation.push(result.processingBreakdown.explanation || 0);
      }
      
      if ((i + 1) % 50 === 0) {
        process.stdout.write(`\r   Progress: ${i + 1}/${iterations} cognitive events processed`);
      }
    }
    
    this.results.cognitive = {
      reasoning: this._calculateStats(cognitiveMetrics.reasoning),
      memory: this._calculateStats(cognitiveMetrics.memory),
      intent: this._calculateStats(cognitiveMetrics.intent),
      explanation: this._calculateStats(cognitiveMetrics.explanation)
    };
    
    console.log(`\n   Reasoning avg: ${this.results.cognitive.reasoning.mean.toFixed(2)}ms`);
    console.log(`   Memory avg: ${this.results.cognitive.memory.mean.toFixed(2)}ms`);
    console.log(`   Intent avg: ${this.results.cognitive.intent.mean.toFixed(2)}ms`);
    console.log(`   Explanation avg: ${this.results.cognitive.explanation.mean.toFixed(2)}ms`);
  }

  async _benchmarkThroughput() {
    console.log('\n🚀 Throughput Benchmark');
    console.log('-'.repeat(30));
    
    const duration = 10000; // 10 seconds
    const startTime = performance.now();
    let eventsProcessed = 0;
    
    console.log(`   Running for ${duration / 1000} seconds...`);
    
    while (performance.now() - startTime < duration) {
      const event = this.testData.events[eventsProcessed % this.testData.events.length];
      await this.interpreter.processEvent(event);
      eventsProcessed++;
      
      if (eventsProcessed % 100 === 0) {
        const elapsed = (performance.now() - startTime) / 1000;
        const currentThroughput = eventsProcessed / elapsed;
        process.stdout.write(`\r   Events: ${eventsProcessed}, Throughput: ${currentThroughput.toFixed(1)} events/sec`);
      }
    }
    
    const totalTime = (performance.now() - startTime) / 1000;
    const throughput = eventsProcessed / totalTime;
    
    this.results.throughput = {
      eventsProcessed,
      duration: totalTime,
      throughput
    };
    
    console.log(`\n   Total events: ${eventsProcessed}`);
    console.log(`   Duration: ${totalTime.toFixed(2)}s`);
    console.log(`   Throughput: ${throughput.toFixed(1)} events/sec`);
  }

  _generateTestData() {
    const baseEvent = {
      timestamp: Date.now(),
      location: 'test_zone',
      type: 'motion_detected'
    };

    return {
      warmupEvents: Array(10).fill(0).map((_, i) => ({
        ...baseEvent,
        id: `warmup_${i}`,
        timestamp: Date.now() + i * 1000
      })),
      
      events: Array(100).fill(0).map((_, i) => ({
        ...baseEvent,
        id: `event_${i}`,
        timestamp: Date.now() + i * 1000,
        confidence: 0.5 + (i % 5) * 0.1,
        metadata: {
          sensor: `sensor_${i % 10}`,
          zone: `zone_${i % 5}`
        }
      })),
      
      complexEvents: Array(50).fill(0).map((_, i) => ({
        ...baseEvent,
        id: `complex_${i}`,
        timestamp: Date.now() + i * 2000,
        type: 'complex_behavior',
        context: {
          previousEvents: Array(5).fill(0).map((_, j) => `prev_${i}_${j}`),
          spatialContext: {
            location: `zone_${i % 3}`,
            adjacentZones: [`zone_${(i + 1) % 3}`, `zone_${(i + 2) % 3}`]
          },
          temporalContext: {
            timeOfDay: (i % 24),
            dayOfWeek: (i % 7)
          }
        }
      })),
      
      cognitiveEvents: Array(30).fill(0).map((_, i) => ({
        ...baseEvent,
        id: `cognitive_${i}`,
        timestamp: Date.now() + i * 3000,
        type: 'cognitive_analysis',
        requiresReasoning: true,
        requiresMemory: true,
        requiresIntent: true,
        requiresExplanation: true,
        complexity: 0.7 + (i % 3) * 0.1
      }))
    };
  }

  _calculateStats(values) {
    if (values.length === 0) return { mean: 0, median: 0, p95: 0, p99: 0, min: 0, max: 0 };
    
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      mean: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: values.length
    };
  }

  _generateReport() {
    console.log('\n📊 Performance Report');
    console.log('=' .repeat(60));
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        latencyTarget: this.results.latency.p95 <= 5.0,
        memoryTarget: this.results.memory.final <= 128 * 1024 * 1024,
        overallPerformance: 'PASS'
      },
      details: this.results
    };
    
    // Determine overall performance
    if (!report.summary.latencyTarget || !report.summary.memoryTarget) {
      report.summary.overallPerformance = 'FAIL';
    }
    
    console.log(`\n🎯 Performance Targets:`);
    console.log(`   Latency (<5ms p95): ${report.summary.latencyTarget ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Memory (<128MB): ${report.summary.memoryTarget ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Overall: ${report.summary.overallPerformance === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log(`\n📈 Key Metrics:`);
    console.log(`   Average Latency: ${this.results.latency.mean.toFixed(2)}ms`);
    console.log(`   Memory Usage: ${(this.results.memory.final / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Throughput: ${this.results.throughput.throughput.toFixed(1)} events/sec`);
    
    // Save detailed report
    const reportPath = path.join(__dirname, 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  }
}

// Memory profiling utilities
class MemoryProfiler {
  static startProfiling() {
    const initialMemory = process.memoryUsage();
    console.log('🔍 Memory profiling started');
    console.log(`   Initial heap: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    
    return {
      start: Date.now(),
      initialMemory
    };
  }
  
  static endProfiling(session) {
    const finalMemory = process.memoryUsage();
    const duration = Date.now() - session.start;
    const growth = finalMemory.heapUsed - session.initialMemory.heapUsed;
    
    console.log('\n📊 Memory Profile Results:');
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Final heap: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Growth: ${(growth / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Growth rate: ${(growth / duration * 1000 / 1024).toFixed(2)}KB/sec`);
    
    return {
      duration,
      initialMemory: session.initialMemory,
      finalMemory,
      growth,
      growthRate: growth / duration * 1000
    };
  }
}

// Run benchmark if called directly
if (require.main === module) {
  const benchmark = new CognitivePerformanceBenchmark();
  
  benchmark.runFullBenchmark().catch(error => {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  });
}

module.exports = {
  CognitivePerformanceBenchmark,
  MemoryProfiler
};