#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process");

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

  try {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🎯 Building ${generation.name}`);
    console.log(`📊 Pokemon ID range: ${generation.range}`);
    console.log(`${"=".repeat(60)}`);

    await runCommand("npm", ["run", "build"], {
      BUILD_GENERATION: generation.id.toString(),
    });

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✅ ${generation.name} build completed in ${duration}s`);

    return { generation, success: true, duration };
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.error(
      `\n❌ ${generation.name} build failed after ${duration}s:`,
      error.message,
    );

    return { generation, success: false, duration, error: error.message };
  }
}

async function mergeBuildOutputs() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔄 Merging build outputs...`);
  console.log(`${"=".repeat(60)}`);

  // For now, just log the completion
  // In a more advanced implementation, you could merge .next directories
  console.log(`✅ Build outputs are ready for deployment`);
}

async function main() {
  const totalStartTime = Date.now();
  const results = [];

  console.log(`🎮 Starting generational Pokemon build process`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
  console.log(`🔢 Total generations to build: ${GENERATIONS.length}`);

  // Build each generation sequentially
  for (let i = 0; i < GENERATIONS.length; i++) {
    const generation = GENERATIONS[i];
    const result = await buildGeneration(generation);
    results.push(result);

    // Short pause between generations to prevent system overload
    if (i < GENERATIONS.length - 1) {
      console.log(`\n⏸️  Pausing 5 seconds before next generation...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Merge outputs if all builds succeeded
  const successfulBuilds = results.filter((r) => r.success);
  const failedBuilds = results.filter((r) => !r.success);

  if (failedBuilds.length === 0) {
    await mergeBuildOutputs();
  }

  // Summary report
  const totalDuration = Math.round((Date.now() - totalStartTime) / 1000);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`📊 GENERATIONAL BUILD SUMMARY`);
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
      console.log(`   • ${result.generation.name} (${result.duration}s)`);
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
