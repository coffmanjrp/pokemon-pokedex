#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process");
const os = require("os");
const fs = require("fs");

// Pokemon generations data
const GENERATIONS = [
  { id: 1, name: "Generation I (Kanto)", range: "1-151" },
  { id: 2, name: "Generation II (Johto)", range: "152-251" },
  { id: 3, name: "Generation III (Hoenn)", range: "252-386" },
  { id: 4, name: "Generation IV (Sinnoh)", range: "387-493" },
  { id: 5, name: "Generation V (Unova)", range: "494-649" },
  { id: 6, name: "Generation VI (Kalos)", range: "650-721" },
  { id: 7, name: "Generation VII (Alola)", range: "722-809" },
  { id: 8, name: "Generation VIII (Galar)", range: "810-905" },
  { id: 9, name: "Generation IX (Paldea)", range: "906-1025" },
];

// Determine optimal parallelism based on CPU cores and memory
function getOptimalParallelism() {
  const cpuCount = os.cpus().length;
  const totalMemory = os.totalmem() / (1024 * 1024 * 1024); // GB

  // Allow override via environment variable
  if (process.env.BUILD_PARALLELISM) {
    const override = parseInt(process.env.BUILD_PARALLELISM);
    if (!isNaN(override) && override > 0) {
      console.log(`⚡ Using BUILD_PARALLELISM override: ${override}`);
      return override;
    }
  }

  // More aggressive parallelism based on resources
  // Each Next.js build uses roughly 2-3GB of memory
  const memoryBasedLimit = Math.floor(totalMemory / 3);
  const cpuBasedLimit = Math.max(1, Math.floor(cpuCount / 2));

  // Use the smaller of the two limits to avoid overloading
  const optimalParallelism = Math.min(memoryBasedLimit, cpuBasedLimit, 4); // Cap at 4 for stability

  console.log(`💡 Calculated optimal parallelism: ${optimalParallelism}`);
  console.log(
    `   (Memory: ${totalMemory.toFixed(1)}GB → ${memoryBasedLimit} parallel)`,
  );
  console.log(`   (CPUs: ${cpuCount} → ${cpuBasedLimit} parallel)`);

  return Math.max(1, optimalParallelism);
}

async function runCommand(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: ${command} ${args.join(" ")}`);
    console.log(`📦 Environment: ${JSON.stringify(env)}`);

    const child = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...env },
      cwd: process.cwd(),
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function buildGeneration(generation) {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();
  const buildDir = `.next-gen-${generation.id}`;

  try {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🎯 Building ${generation.name}`);
    console.log(`📊 Pokemon ID range: ${generation.range}`);
    console.log(`📁 Output directory: ${buildDir}`);
    console.log(
      `💾 Start Memory: ${Math.round(startMemory.heapUsed / (1024 * 1024))}MB`,
    );
    console.log(`${"=".repeat(60)}`);

    // Clean up any existing build directory for this generation
    if (fs.existsSync(buildDir)) {
      console.log(`🧹 Cleaning up existing ${buildDir} directory...`);
      fs.rmSync(buildDir, { recursive: true, force: true });
    }

    await runCommand("npm", ["run", "build"], {
      BUILD_GENERATION: generation.id.toString(),
      ENABLE_GENERATIONAL_BUILD: "true",
      NEXT_OUT_DIR: buildDir,
    });

    const duration = Math.round((Date.now() - startTime) / 1000);
    const endMemory = process.memoryUsage();
    const memoryIncrease = Math.round(
      (endMemory.heapUsed - startMemory.heapUsed) / (1024 * 1024),
    );

    console.log(`\n✅ ${generation.name} build completed`);
    console.log(
      `   ⏱️  Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`,
    );
    console.log(`   💾 Memory increase: ${memoryIncrease}MB`);
    console.log(
      `   📈 Peak memory: ${Math.round(endMemory.heapUsed / (1024 * 1024))}MB`,
    );

    return {
      generation,
      success: true,
      duration,
      buildDir,
      memoryUsage: {
        start: Math.round(startMemory.heapUsed / (1024 * 1024)),
        end: Math.round(endMemory.heapUsed / (1024 * 1024)),
        increase: memoryIncrease,
      },
    };
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.error(
      `\n❌ ${generation.name} build failed after ${duration}s:`,
      error.message,
    );

    return { generation, success: false, duration, error: error.message };
  }
}

async function buildGenerationsInParallel(generations, parallelism) {
  const results = [];
  const totalBatches = Math.ceil(generations.length / parallelism);

  // Process generations in batches
  for (let i = 0; i < generations.length; i += parallelism) {
    const batch = generations.slice(i, i + parallelism);
    const batchNumber = Math.floor(i / parallelism) + 1;

    console.log(`\n${"=".repeat(60)}`);
    console.log(`🔄 Batch ${batchNumber}/${totalBatches}`);
    console.log(`📦 Building: ${batch.map((g) => g.name).join(", ")}`);
    console.log(`⏱️  Estimated time: ${batch.length * 3} minutes`);
    console.log(`${"=".repeat(60)}`);

    // Build current batch in parallel
    const batchStartTime = Date.now();
    const batchPromises = batch.map((generation) =>
      buildGeneration(generation),
    );
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    const batchDuration = Math.round((Date.now() - batchStartTime) / 1000);
    console.log(
      `\n✅ Batch ${batchNumber} completed in ${Math.floor(batchDuration / 60)}m ${batchDuration % 60}s`,
    );

    // Shorter pause between batches (5 seconds instead of 15)
    if (i + parallelism < generations.length) {
      console.log(`\n⏸️  Pausing 5 seconds before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  return results;
}

// Clean up generation-specific build directories
function cleanupBuildDirectories() {
  console.log(`\n🧹 Cleaning up generation build directories...`);
  const files = fs.readdirSync(".");
  files.forEach((file) => {
    if (file.startsWith(".next-gen-")) {
      console.log(`   Removing ${file}`);
      fs.rmSync(file, { recursive: true, force: true });
    }
  });
}

async function main() {
  const totalStartTime = Date.now();
  const parallelism = getOptimalParallelism();

  console.log(`🎮 Starting parallel generational Pokemon build process`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🔢 Total generations to build: ${GENERATIONS.length}`);
  console.log(`⚡ Parallel builds: ${parallelism}`);
  console.log(`💻 CPU cores: ${os.cpus().length}`);
  console.log(
    `💾 Total memory: ${Math.round(os.totalmem() / (1024 * 1024 * 1024))}GB`,
  );

  // Build generations in parallel batches
  const results = await buildGenerationsInParallel(GENERATIONS, parallelism);

  // Summary report
  const successfulBuilds = results.filter((r) => r.success);
  const failedBuilds = results.filter((r) => !r.success);
  const totalDuration = Math.round((Date.now() - totalStartTime) / 1000);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 PARALLEL BUILD SUMMARY`);
  console.log(`${"=".repeat(60)}`);
  console.log(
    `✅ Successful builds: ${successfulBuilds.length}/${GENERATIONS.length}`,
  );
  console.log(`❌ Failed builds: ${failedBuilds.length}/${GENERATIONS.length}`);
  console.log(
    `⏱️  Total duration: ${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s`,
  );

  if (successfulBuilds.length > 0) {
    console.log(`\n✅ Successful generations:`);
    successfulBuilds.forEach((result) => {
      const memInfo = result.memoryUsage
        ? ` | Memory: ${result.memoryUsage.increase}MB increase`
        : "";
      const dirInfo = result.buildDir ? ` | Dir: ${result.buildDir}` : "";
      console.log(
        `   • ${result.generation.name} (${result.duration}s${memInfo}${dirInfo})`,
      );
    });

    // Calculate average memory usage
    const buildsWithMemory = successfulBuilds.filter((r) => r.memoryUsage);
    if (buildsWithMemory.length > 0) {
      const avgMemoryIncrease = Math.round(
        buildsWithMemory.reduce((sum, r) => sum + r.memoryUsage.increase, 0) /
          buildsWithMemory.length,
      );
      console.log(
        `\n💾 Average memory increase per generation: ${avgMemoryIncrease}MB`,
      );
    }

    console.log(`\n📁 Build directories created:`);
    successfulBuilds.forEach((result) => {
      if (result.buildDir) {
        console.log(`   • ${result.buildDir}`);
      }
    });
  }

  if (failedBuilds.length > 0) {
    console.log(`\n❌ Failed generations:`);
    failedBuilds.forEach((result) => {
      console.log(
        `   • ${result.generation.name} (${result.duration}s): ${result.error}`,
      );
    });
  }

  console.log(`\n📅 Completed at: ${new Date().toISOString()}`);

  // Auto merge if requested and all builds succeeded
  if (
    process.env.AUTO_MERGE === "true" &&
    failedBuilds.length === 0 &&
    successfulBuilds.length === GENERATIONS.length
  ) {
    console.log(`\n🔀 Starting automatic merge of build directories...`);
    try {
      const { execSync } = require("child_process");
      execSync("npm run build:merge", { stdio: "inherit" });
      console.log(`✅ Merge completed successfully!`);

      // Clean up after successful merge if AUTO_CLEANUP is also true
      if (process.env.AUTO_CLEANUP === "true") {
        cleanupBuildDirectories();
      }
    } catch (error) {
      console.error(`❌ Merge failed:`, error.message);
    }
  } else {
    // Ask about cleanup if successful builds exist
    if (successfulBuilds.length > 0 && process.env.AUTO_CLEANUP !== "true") {
      console.log(`\n💡 To merge build directories, run:`);
      console.log(`   npm run build:merge`);
      console.log(`\n💡 To clean up build directories, run:`);
      console.log(`   rm -rf .next-gen-*`);
      console.log(
        `\n   Or use AUTO_MERGE=true AUTO_CLEANUP=true for automatic processing`,
      );
    }

    // Auto cleanup if requested
    if (process.env.AUTO_CLEANUP === "true" && successfulBuilds.length > 0) {
      cleanupBuildDirectories();
    }
  }

  // Exit with error code if any builds failed
  if (failedBuilds.length > 0) {
    process.exit(1);
  } else {
    console.log(`\n🎉 All generations built successfully!`);
    process.exit(0);
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
