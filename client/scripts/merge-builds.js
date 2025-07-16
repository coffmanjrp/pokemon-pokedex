#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

// Function to copy directory recursively
function copyDir(src, dest) {
  // Check if source exists and is a directory
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Source does not exist: ${src}`);
    return;
  }

  const srcStat = fs.statSync(src);
  if (!srcStat.isDirectory()) {
    console.warn(`⚠️  Source is not a directory: ${src}`);
    return;
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all items in source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to merge JSON files
function mergeJsonFiles(srcPath, destPath) {
  let destData = {};

  // Read existing destination file if it exists
  if (fs.existsSync(destPath)) {
    try {
      destData = JSON.parse(fs.readFileSync(destPath, "utf8"));
    } catch {
      console.warn(`⚠️  Could not parse existing ${destPath}, will overwrite`);
    }
  }

  // Read source file
  try {
    const srcData = JSON.parse(fs.readFileSync(srcPath, "utf8"));
    // Merge objects (source overwrites destination)
    Object.assign(destData, srcData);
    // Write merged data
    fs.writeFileSync(destPath, JSON.stringify(destData, null, 2));
  } catch (error) {
    console.error(`❌ Error merging ${srcPath}: ${error.message}`);
  }
}

// Main merge function
async function mergeBuildDirectories() {
  console.log(`🔀 Starting build directory merge process...`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);

  const targetDir = ".next";
  const genDirs = [];

  // Find all generation build directories
  const files = fs.readdirSync(".");
  for (const file of files) {
    if (file.startsWith(".next-gen-") && fs.statSync(file).isDirectory()) {
      genDirs.push(file);
    }
  }

  if (genDirs.length === 0) {
    console.error(`❌ No generation build directories found (.next-gen-*)`);
    console.log(`💡 Make sure to run 'npm run build:parallel' first`);
    process.exit(1);
  }

  console.log(`📁 Found ${genDirs.length} generation build directories:`);
  genDirs.forEach((dir) => console.log(`   • ${dir}`));

  // Clean up existing .next directory
  if (fs.existsSync(targetDir)) {
    console.log(`\n🧹 Cleaning up existing ${targetDir} directory...`);
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  // Create target directory
  fs.mkdirSync(targetDir, { recursive: true });

  // Use the first generation directory as base
  const baseDir = genDirs[0];
  console.log(`\n📋 Using ${baseDir} as base structure...`);

  // Copy base structure
  copyDir(baseDir, targetDir);

  // Key directories and files that need special handling
  const staticPagesDir = path.join(targetDir, "server", "app");
  const pagesManifest = path.join(targetDir, "server", "pages-manifest.json");
  const appPathsManifest = path.join(
    targetDir,
    "server",
    "app-paths-manifest.json",
  );

  // Merge remaining generation directories
  for (let i = 1; i < genDirs.length; i++) {
    const genDir = genDirs[i];
    console.log(`\n🔄 Merging ${genDir}...`);

    // Merge static pages
    const genStaticDir = path.join(genDir, "server", "app");
    if (fs.existsSync(genStaticDir)) {
      console.log(`   • Merging static pages...`);
      copyDir(genStaticDir, staticPagesDir);
    }

    // Merge manifests
    const genPagesManifest = path.join(genDir, "server", "pages-manifest.json");
    if (fs.existsSync(genPagesManifest)) {
      console.log(`   • Merging pages manifest...`);
      mergeJsonFiles(genPagesManifest, pagesManifest);
    }

    const genAppPathsManifest = path.join(
      genDir,
      "server",
      "app-paths-manifest.json",
    );
    if (fs.existsSync(genAppPathsManifest)) {
      console.log(`   • Merging app paths manifest...`);
      mergeJsonFiles(genAppPathsManifest, appPathsManifest);
    }

    // Copy any unique trace files
    const genTraceDir = path.join(genDir, "trace");
    const targetTraceDir = path.join(targetDir, "trace");
    if (fs.existsSync(genTraceDir)) {
      const traceStat = fs.statSync(genTraceDir);
      if (traceStat.isDirectory()) {
        console.log(`   • Merging trace files...`);
        if (!fs.existsSync(targetTraceDir)) {
          fs.mkdirSync(targetTraceDir, { recursive: true });
        }
        copyDir(genTraceDir, targetTraceDir);
      } else {
        console.log(`   • Skipping trace (not a directory)...`);
      }
    }
  }

  // Create build ID from the first generation
  const buildIdPath = path.join(targetDir, "BUILD_ID");
  if (!fs.existsSync(buildIdPath)) {
    const baseBuildIdPath = path.join(baseDir, "BUILD_ID");
    if (fs.existsSync(baseBuildIdPath)) {
      fs.copyFileSync(baseBuildIdPath, buildIdPath);
    } else {
      // Generate a new build ID if none exists
      const buildId = Date.now().toString(36);
      fs.writeFileSync(buildIdPath, buildId);
    }
  }

  console.log(`\n✅ Merge completed successfully!`);
  console.log(`📁 Output directory: ${targetDir}`);
  console.log(`📅 Completed at: ${new Date().toISOString()}`);

  // Verify the merge
  const requiredFiles = [
    "BUILD_ID",
    "build-manifest.json",
    "server/pages-manifest.json",
    "server/app-build-manifest.json",
  ];

  console.log(`\n🔍 Verifying merged build...`);
  let allFilesExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(targetDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} (missing)`);
      allFilesExist = false;
    }
  }

  if (allFilesExist) {
    console.log(`\n🎉 Build merge completed successfully!`);
    console.log(
      `💡 You can now run 'npm run start' to start the production server`,
    );
  } else {
    console.log(`\n⚠️  Some files are missing, but the build might still work`);
  }
}

// Handle errors
process.on("unhandledRejection", (error) => {
  console.error(`\n💥 Unexpected error:`, error);
  process.exit(1);
});

// Run the merge
mergeBuildDirectories().catch((error) => {
  console.error(`\n💥 Merge failed:`, error);
  process.exit(1);
});
