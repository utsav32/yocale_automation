import fs from "fs";
import path from "path";

async function globalTeardown() {
  console.log("Archiving test data...");

  const testDataPath = path.resolve(__dirname, "testData.json");

  if (!fs.existsSync(testDataPath)) {
    console.warn("No testData.json found, skipping archive");
    return;
  }

  // Ensure historical folder exists
  const historicalFolder = path.resolve(__dirname, "historicalTestData");
  if (!fs.existsSync(historicalFolder)) {
    fs.mkdirSync(historicalFolder);
  }

  // Create timestamped filename
  const timestamp = Date.now();
  const archivedName = `testData_${timestamp}.json`;
  const archivedPath = path.resolve(historicalFolder, archivedName);

  // Copy testData.json → historical folder
  fs.copyFileSync(testDataPath, archivedPath);

  console.log(`Archived test data as ${archivedName}`);
  console.log("testData.json preserved for debugging");
}

export default globalTeardown;
