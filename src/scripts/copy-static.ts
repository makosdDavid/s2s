import fs from 'fs';
import path from 'path';

// Source and destination directories
const sourceDir = path.join(process.cwd(), 'src', 'public');
const destDir = path.join(process.cwd(), 'dist', 'public');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Copy files from source to destination
function copyFiles(source: string, dest: string) {
  // Get all files in the source directory
  const files = fs.readdirSync(source);

  // Copy each file to the destination directory
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(dest, file);

    // Check if the current item is a directory
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // Create the directory in the destination if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      // Recursively copy files in the subdirectory
      copyFiles(sourcePath, destPath);
    } else {
      // Copy the file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
    }
  }
}

// Start copying files
try {
  copyFiles(sourceDir, destDir);
  console.log('Static files copied successfully!');
} catch (error) {
  console.error('Error copying static files:', error);
  process.exit(1);
} 