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

  test("@UI @P1 S-1: should navigate to service creation page, fill required fields, and submit", async ({
    page,
  }) => {});

  test("@UI @P1 S-1: should fill required fields plus optional fields and submit", async ({
    page,
  }) => {});

  test("@UI @P1 S-1: should attempt submission with missing required fields", async ({
    page,
  }) => {});

  test("@UI @P1 S-1: should submit with invalid data", async ({ page }) => {});

  test("@UI @P1 S-1: should refresh after creation and confirm service is visible", async ({
    page,
  }) => {});

  test("@UI @P1 S-2: should select existing service, edit required fields, and save", async ({
    page,
  }) => {});

  test("@UI @P1 S-2: should edit optional fields", async ({ page }) => {});

  test("@UI @P1 S-2: should edit with invalid inputs", async ({ page }) => {});

  test("@UI @P1 S-2: should simulate existing bookings to ensure they show original values", async ({
    page,
  }) => {});

  test("@UI @P1 S-2: should create a new booking after edit and verify it uses updated service details", async ({
    page,
  }) => {});

  test("@UI @P1 S-3: should delete service via UI", async ({ page }) => {});

  test("@UI @P1 S-3: should confirm deletion confirmation dialog and success message", async ({
    page,
  }) => {});

  test("@UI @P1 S-3: should verify existing bookings still show the deleted service details", async ({
    page,
  }) => {});

  test("@UI @P1 S-3: should attempt to book the deleted service and confirm it's not available", async ({
    page,
  }) => {});

  test("@UI @P1 S-3: should test deactivation if available", async ({
    page,
  }) => {});

  test("@UI @P1 S-4: should assign provider to service via UI", async ({
    page,
  }) => {});

  test("@UI @P1 S-4: should assign multiple providers", async ({ page }) => {});

  test("@UI @P1 S-4: should unassign provider", async ({ page }) => {});

  test("@UI @P1 S-4: should check booking widget and ensure only assigned providers appear", async ({
    page,
  }) => {});

  test("@UI @P1 S-4: should verify existing appointments still show unassigned providers", async ({
    page,
  }) => {});

  test("@UI @P1 S-5: should assign service to location via UI", async ({
    page,
  }) => {});

  test("@UI @P1 S-5: should assign to multiple locations", async ({
    page,
  }) => {});

  test("@UI @P1 S-5: should unassign from location", async ({ page }) => {});

  test("@UI @P1 S-5: should navigate to booking widget and confirm only assigned services are shown", async ({
    page,
  }) => {});

  test("@UI @P1 S-5: should check existing bookings at the location to ensure they remain valid", async ({
    page,
  }) => {});

  test("@UI @P1 S-6: should attach resource to service via UI", async ({
    page,
  }) => {});

  test("@UI @P1 S-6: should attach multiple resources", async ({ page }) => {});

  test("@UI @P1 S-6: should detach resource", async ({ page }) => {});

  test("@UI @P1 S-6: should simulate booking with all resources available", async ({
    page,
  }) => {});

  test("@UI @P1 S-6: should simulate booking with unavailable resource", async ({
    page,
  }) => {});

  test("@UI @P1 S-7: should attach form to service via UI and set as required-per-appointment", async ({
    page,
  }) => {});

  test("@UI @P1 S-7: should set form as required-per-client", async ({
    page,
  }) => {});

  test("@UI @P1 S-7: should attempt booking without filling required form", async ({
    page,
  }) => {});

  test("@UI @P1 S-7: should fill form during booking and confirm booking completes", async ({
    page,
  }) => {});

  test("@UI @P1 S-7: should detach form", async ({ page }) => {});

  test("@UI @P1 S-8: should toggle online booking on via UI", async ({
    page,
  }) => {});

  test("@UI @P1 S-8: should set minimum notice rule and attempt booking within notice period", async ({
    page,
  }) => {});

  test("@UI @P1 S-8: should set time window and verify bookings outside window are blocked", async ({
    page,
  }) => {});

  test("@UI @P1 S-8: should toggle off and confirm service disappears from booking widget", async ({
    page,
  }) => {});

  test("@UI @P1 S-8: should test rule combinations in booking flow", async ({
    page,
  }) => {});

  test("@UI @P1 S-9: should assign service to category via UI", async ({
    page,
  }) => {});

  test("@UI @P1 S-9: should configure display order", async ({ page }) => {});

  test("@UI @P1 S-9: should change category", async ({ page }) => {});

  test("@UI @P1 S-9: should view booking widget and ensure services are ordered correctly", async ({
    page,
  }) => {});

  test("@UI @P1 S-9: should test reordering and verify immediate reflection", async ({
    page,
  }) => {});
});
