import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const validEmail = process.env.VALID_ADMIN_EMAIL;
if (!validEmail) {
  throw new Error("Token is not defined on .env");
}

const validPassword = process.env.VALID_ADMIN_PASSWORD;
if (!validPassword) {
  throw new Error("Token is not defined on .env");
}

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(validEmail, validPassword);
    await page
      .waitForResponse((response) => {
        return (
          response.url().includes("/api/v1/gettenant") &&
          response.status() === 200
        );
      })
      .then(async (response) => {
        const responseBody = await response.json();
        const token = responseBody.token || responseBody.access_token;
        const tenantId = responseBody.tenant_id;
        //save this token adn tenantID in the testData.json file to be used in the UI tests to make API calls to create, edit and delete the service.
        const fs = require("fs");
        const testDataPath = path.resolve(__dirname, "testData.json");
        const testData = {
          auth: {
            token,
            tenantId,
          },
        };
        fs.writeFileSync(testDataPath, JSON.stringify(testData));
      });

    // Use the fixture in the test.
    await use(loginPage);
  },
});
export { expect } from "@playwright/test";
