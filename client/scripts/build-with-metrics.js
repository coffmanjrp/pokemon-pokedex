#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Build metrics tracking
class BuildMetrics {
  constructor() {
    this.startTime = Date.now();
    this.startMemory = process.memoryUsage();
    this.cpuUsage = process.cpuUsage();
    this.metrics = {
      startTime: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        cpus: os.cpus().length,
        totalMemory: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + "GB",
        freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024)) + "GB",
      },
      buildType:
        process.env.ENABLE_GENERATIONAL_BUILD === "true"
          ? "generational"
          : "standard",
      generation: process.env.BUILD_GENERATION || "all",
      phases: [],
    };
  }

  recordPhase(phaseName, data = {}) {
    const currentTime = Date.now();
    const currentMemory = process.memoryUsage();
    const currentCpu = process.cpuUsage();

    const phase = {
      name: phaseName,
      timestamp: new Date().toISOString(),
      duration: currentTime - this.startTime,
      memory: {
        heapUsed: Math.round(currentMemory.heapUsed / (1024 * 1024)) + "MB",
        heapTotal: Math.round(currentMemory.heapTotal / (1024 * 1024)) + "MB",
        external: Math.round(currentMemory.external / (1024 * 1024)) + "MB",
        rss: Math.round(currentMemory.rss / (1024 * 1024)) + "MB",
      },
      cpu: {
        user: Math.round((currentCpu.user - this.cpuUsage.user) / 1000) + "ms",
        system:
          Math.round((currentCpu.system - this.cpuUsage.system) / 1000) + "ms",
      },
      ...data,
    };

    this.metrics.phases.push(phase);
    console.log(`\n📊 Phase: ${phaseName}`);
    console.log(`   Duration: ${Math.round(phase.duration / 1000)}s`);
    console.log(
      `   Memory: ${phase.memory.heapUsed} / ${phase.memory.heapTotal}`,
    );
  }

  finalize() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;

    this.metrics.endTime = new Date().toISOString();
    this.metrics.totalDuration = Math.round(totalDuration / 1000) + "s";
    this.metrics.totalDurationMinutes =
      (totalDuration / 60000).toFixed(2) + "min";

    // Save metrics to file
    const metricsDir = path.join(process.cwd(), ".next", "build-metrics");
    if (!fs.existsSync(metricsDir)) {
      fs.mkdirSync(metricsDir, { recursive: true });
    }

    const metricsFile = path.join(
      metricsDir,
      `build-metrics-${Date.now()}.json`,
    );
    fs.writeFileSync(metricsFile, JSON.stringify(this.metrics, null, 2));

    console.log(`\n📈 Build metrics saved to: ${metricsFile}`);
    return this.metrics;
  }
}

// Run build with metrics
async function runBuildWithMetrics() {
  const metrics = new BuildMetrics();

  // Record initial phase
  metrics.recordPhase("Build Started");

  return new Promise((resolve, reject) => {
    const buildProcess = spawn("npm", ["run", "build:legacy"], {
      stdio: ["inherit", "pipe", "pipe"],
      env: process.env,
    });

    buildProcess.stdout.on("data", (data) => {
      const output = data.toString();
      process.stdout.write(data);

      // Track key build phases
      if (output.includes("Creating an optimized production build")) {
        metrics.recordPhase("Production Build Started");
      } else if (output.includes("Collecting page data")) {
        metrics.recordPhase("Collecting Page Data");
      } else if (output.includes("Generating static pages")) {
        metrics.recordPhase("Generating Static Pages");
      } else if (output.includes("Finalizing page optimization")) {
        metrics.recordPhase("Finalizing Optimization");
      }
    });

    buildProcess.stderr.on("data", (data) => {
      process.stderr.write(data);
    });

    buildProcess.on("close", (code) => {
      metrics.recordPhase("Build Completed", { exitCode: code });

      const finalMetrics = metrics.finalize();

      // Print summary
      console.log(`\n${"=".repeat(60)}`);
      console.log(`📊 BUILD METRICS SUMMARY`);
      console.log(`${"=".repeat(60)}`);
      console.log(`Total Duration: ${finalMetrics.totalDurationMinutes}`);
      console.log(`Build Type: ${finalMetrics.buildType}`);
      console.log(`Generation: ${finalMetrics.generation}`);
      console.log(`Exit Code: ${code}`);
      console.log(`${"=".repeat(60)}\n`);

      if (code === 0) {
        resolve(finalMetrics);
      } else {
        reject(new Error(`Build failed with exit code ${code}`));
      }
    });

    buildProcess.on("error", (error) => {
      metrics.recordPhase("Build Error", { error: error.message });
      reject(error);
    });
  });
}

// Monitor system resources during build
function startResourceMonitor() {
  const interval = setInterval(() => {
    const memory = process.memoryUsage();
    const cpu = process.cpuUsage();

    console.log(`\n⚡ Resource Usage:`);
    console.log(
      `   Heap: ${Math.round(memory.heapUsed / (1024 * 1024))}MB / ${Math.round(memory.heapTotal / (1024 * 1024))}MB`,
    );
    console.log(`   RSS: ${Math.round(memory.rss / (1024 * 1024))}MB`);
    console.log(
      `   CPU: ${Math.round(cpu.user / 1000)}ms user, ${Math.round(cpu.system / 1000)}ms system`,
    );
  }, 30000); // Every 30 seconds

  return () => clearInterval(interval);
}

// Main execution
async function main() {
  console.log(`🚀 Starting build with metrics collection...`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);

  const stopMonitor = startResourceMonitor();

  try {
    await runBuildWithMetrics();
    console.log(`\n✅ Build completed successfully!`);
  } catch (error) {
    console.error(`\n❌ Build failed:`, error.message);
    process.exit(1);
  } finally {
    stopMonitor();
  }
}

// Handle process termination
process.on("SIGINT", () => {
  console.log(`\n\n⚠️  Build process interrupted by user`);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log(`\n\n⚠️  Build process terminated`);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  console.error(`\n💥 Unexpected error:`, error);
  process.exit(1);
});
