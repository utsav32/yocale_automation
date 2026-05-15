import { test } from "../fixtures/fixtures";
import { expect } from "@playwright/test";
import { ServiceManagementPage } from "../pages/serviceManagement";
import testData from "../../../testData.json";

test.describe.configure({ mode: "parallel" });

test.describe("Service Management - E2E", () => {
  let servicePage: ServiceManagementPage;
  const baseURL = "https://yocale-test.staging.com";

  let tenantId: string = testData.admin.tenantId;
  let authToken: string = testData.admin.authToken;

  test.beforeEach(async ({ page, request }) => {
    servicePage = new ServiceManagementPage(page);
    await servicePage.navigateToServices();
  });

  test("@UI @P1 should create a new service via UI", async ({ page }) => {
    const serviceName = `UIService-${Date.now()}`;
    await servicePage.createService({
      name: serviceName,
      duration: 45,
      price: 95,
    });

    const successMsg = await servicePage.getSuccessMessage();
    expect(successMsg).toContain("Created successfully");

    await servicePage.waitForServiceToAppear(serviceName);
    const isVisible = await servicePage.isServiceVisible(serviceName);
    expect(isVisible).toBe(true);

    const serviceData = await servicePage.getServiceDataByName(serviceName);
    expect(serviceData.serviceName).toBe(serviceName);
    expect(serviceData.duration).toBe(45);
    expect(serviceData.price).toBe(95);
  });

  test("@UI @P1 should edit service via UI", async ({ page, request }) => {
    const testServiceName = `EditTest-${Date.now()}`;
    const createResponse = await request.post(`${baseURL}/api/v1/services`, {
      headers: {
        ServiceProviderID: tenantId,
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      data: {
        name: testServiceName,
        duration: 60,
        price: 100,
      },
    });

    expect(createResponse.ok()).toBe(true);

    await servicePage.searchService(testServiceName);
    await servicePage.editService(testServiceName, {
      name: `${testServiceName}-Updated`,
      price: 150,
    });

    await servicePage.searchService(`${testServiceName}-Updated`);
    const isVisible = await servicePage.isServiceVisible(
      `${testServiceName}-Updated`,
    );
    expect(isVisible).toBe(true);

    const service = await createResponse.json();
    await request.delete(`${baseURL}/api/v1/services/${service.id}`, {
      headers: {
        ServiceProviderID: tenantId,
        Authorization: `Bearer ${authToken}`,
      },
    });
  });

  test("@UI @P1 should delete service via UI", async ({ page, request }) => {
    const testServiceName = `DeleteTest-${Date.now()}`;
    const createResponse = await request.post(`${baseURL}/api/v1/services`, {
      headers: {
        ServiceProviderID: tenantId,
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      data: {
        name: testServiceName,
        duration: 30,
        price: 50,
      },
    });

    expect(createResponse.ok()).toBe(true);

    const countBefore = await servicePage.getServiceCount();
    await servicePage.deleteService(testServiceName);

    const countAfter = await servicePage.getServiceCount();
    expect(countAfter).toBeLessThan(countBefore);

    const isVisible = await servicePage.isServiceVisible(testServiceName);
    expect(isVisible).toBe(false);
  });
});
