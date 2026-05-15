import dotenv from "dotenv";
import path from "path";
import { faker } from "@faker-js/faker";
import fs from "fs";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default async function globalSetup() {
  console.log("🚀 Setting up test data...");

  const testDataPath = path.resolve(__dirname, "testData.json");

  // If testData.json exists, delete it
  if (fs.existsSync(testDataPath)) {
    fs.unlinkSync(testDataPath);
  }

  //Adding test data to test the login functionality with valid and invalid credentials. The valid credentials are taken from the .env file and the invalid credentials are generated using faker library.
  const adminEmail = process.env.VALID_ADMIN_EMAIL;
  const adminPassword = process.env.VALID_ADMIN_PASSWORD;
  const inValidEmail = faker.internet.email();
  const inValidPassword = faker.internet.password();

  //Adding test data for the service management tests. This will create a service that can be used in the tests to edit and delete the service.
  const serviceName = `Test Service ${Date.now()}`;
  const serviceDuration = faker.number.int({ min: 15, max: 120 });
  const servicePrice = faker.number.int({ min: 10, max: 500 });

  //Adding auth and tenant ID
  const token = faker.string.uuid();
  const tenantId = faker.string.uuid();

  const testData = {
    admin: {
      adminEmail,
      adminPassword,
      inValidEmail,
      inValidPassword,
      authToken: token,
      tenantId: tenantId,
    },
    service: {
      serviceName,
      serviceDuration,
      servicePrice,
    },
  };
  fs.writeFileSync(testDataPath, JSON.stringify(testData));
}
