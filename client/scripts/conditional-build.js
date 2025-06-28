#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

/**
 * Conditional Build Script
 *
 * Automatically chooses between standard Next.js build and generational build
 * based on the ENABLE_GENERATIONAL_BUILD environment variable.
 *
 * Usage:
 * - npm run build (automatic detection)
 * - ENABLE_GENERATIONAL_BUILD=true npm run build (force generational)
 * - ENABLE_GENERATIONAL_BUILD=false npm run build (force standard)
 */

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: ${command} ${args.join(" ")}`);

    const child = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...options.env },
      cwd: process.cwd(),
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

async function runStandardBuild() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📦 Running Standard Next.js Build`);
  console.log(`⚡ Fast build with all generations at once`);
  console.log(`${"=".repeat(60)}`);

  try {
    await runCommand("npm", ["run", "build:legacy"]);
    console.log(`\n✅ Standard build completed successfully`);
    return 0;
  } catch (error) {
    console.error(`\n❌ Standard build failed:`, error.message);
    return 1;
  }
}

async function runGenerationalBuild() {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🎮 Running Generational Build`);
  console.log(`🔄 Memory-efficient build by Pokemon generation`);
  console.log(`${"=".repeat(60)}`);

  try {
    // Import and run the generational build script
    const generationalBuildPath = path.join(
      __dirname,
      "build-all-generations.js",
    );

    // Run the generational build script
    await runCommand("node", [generationalBuildPath]);
    console.log(`\n✅ Generational build completed successfully`);
    return 0;
  } catch (error) {
    console.error(`\n❌ Generational build failed:`, error.message);
    return 1;
  }
}

// Load .env.local file if it exists
function loadEnvLocal() {
  const envLocalPath = path.join(process.cwd(), ".env.local");

  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, "utf8");
    const envLines = envContent
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"));

    envLines.forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value && !process.env[key.trim()]) {
        process.env[key.trim()] = value.trim();
      }
    });

    console.log(`📄 Loaded .env.local configuration`);
  }
}

async function main() {
  const startTime = Date.now();

  // Load .env.local before checking environment variables
  loadEnvLocal();

  // Check environment variables to determine build mode
  const buildGeneration = process.env.BUILD_GENERATION;
  const enableGenerationalBuild =
    process.env.ENABLE_GENERATIONAL_BUILD === "true";

  console.log(`🎯 Conditional Build System`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);

  // Priority logic: BUILD_GENERATION > ENABLE_GENERATIONAL_BUILD
  let buildMode;
  if (buildGeneration) {
    buildMode = "SINGLE_GENERATION";
    console.log(
      `🔧 Build mode: SINGLE_GENERATION (Generation ${buildGeneration})`,
    );
    console.log(`💡 Detected BUILD_GENERATION=${buildGeneration}`);
    console.log(
      `🎯 Building only Generation ${buildGeneration} with legacy build`,
    );
  } else if (enableGenerationalBuild) {
    buildMode = "GENERATIONAL";
    console.log(`🔧 Build mode: GENERATIONAL`);
    console.log(`💡 Detected ENABLE_GENERATIONAL_BUILD=true`);
    console.log(`🎮 Switching to generational build for optimal memory usage`);
  } else {
    buildMode = "STANDARD";
    console.log(`🔧 Build mode: STANDARD`);
    console.log(
      `💡 Using standard build (set ENABLE_GENERATIONAL_BUILD=true for generational)`,
    );
    console.log(`⚡ Fast build with all pages generated at once`);
  }

  let exitCode;
  try {
    if (buildMode === "SINGLE_GENERATION" || buildMode === "STANDARD") {
      exitCode = await runStandardBuild();
    } else if (buildMode === "GENERATIONAL") {
      exitCode = await runGenerationalBuild();
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(
      `\n📊 Build completed in ${Math.floor(duration / 60)}m ${duration % 60}s`,
    );
    console.log(`📅 Finished at: ${new Date().toISOString()}`);

    if (exitCode === 0) {
      console.log(`\n🎉 Build process completed successfully!`);
    }
  } catch (error) {
    console.error(`\n💥 Build process failed:`, error.message);
    exitCode = 1;
  }

  process.exit(exitCode);
}

// Handle process termination gracefully
process.on("SIGINT", () => {
  console.log(`\n\n⚠️  Build process interrupted by user`);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log(`\n\n⚠️  Build process terminated`);
  process.exit(1);
});

// Catch unhandled errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("\n💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("\n💥 Uncaught Exception:", error);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  console.error(`\n💥 Unexpected error in main:`, error);
  process.exit(1);
});
