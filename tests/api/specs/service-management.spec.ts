import { test, expect } from "@playwright/test";

test.describe("Service Management - API", () => {
  let baseURL: string;
  let tenantId: string;
  let testServiceId: string;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    baseURL = "https://yocale-test.staging.com";

    // Login as tenant admin to get auth token
    const adminEmail = process.env.ADMIN_EMAIL || "admin@test.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    const loginResponse = await request.post(`${baseURL}/api/v1/auth/login`, {
      headers: { "Content-Type": "application/json" },
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    });

    if (loginResponse.ok()) {
      const loginData = await loginResponse.json();
      authToken = loginData.token || loginData.access_token;
      console.log("Auth token obtained for API tests");
      tenantId = loginData.tenant_id;
      console.log("tenant ID obtained for service provider for API tests");
    } else {
      console.warn(`Login failed: ${loginResponse.status()}`);
      authToken = "";
    }
  });

  test.afterEach(async ({ request }) => {
    if (testServiceId) {
      await request
        .delete(`${baseURL}/api/v1/services/${testServiceId}`, {
          headers: {
            ServiceProviderID: tenantId,
            Authorization: `Bearer ${authToken}`,
          },
        })
        .catch(() => {});
    }
  });

  test("@API @P0 should create service with required fields", async ({
    request,
  }) => {
    const serviceName = `TestService-${Date.now()}`;
    const payload = {
      name: serviceName,
      duration: 60,
      price: 100,
    };

    const response = await request.post(`${baseURL}/api/v1/services`, {
      headers: {
        ServiceProviderID: tenantId,
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });

    expect(response.status()).toBe(201);
    const service = await response.json();
    expect(service.id).toBeTruthy();
    expect(service.name).toBe(serviceName);
    expect(service.duration).toBe(60);
    expect(service.price).toBe(100);
    expect(service.active).toBe(true);

    testServiceId = service.id;
  });

  test("@API @P0 should update service price", async ({ request }) => {
    const createResponse = await request.post(`${baseURL}/api/v1/services`, {
      headers: {
        ServiceProviderID: tenantId,
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      data: {
        name: `Service-${Date.now()}`,
        duration: 45,
        price: 75,
      },
    });

    const service = await createResponse.json();
    testServiceId = service.id;

    const updateResponse = await request.patch(
      `${baseURL}/api/v1/services/${service.id}`,
      {
        headers: {
          ServiceProviderID: tenantId,
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        data: { price: 150 },
      },
    );

    expect(updateResponse.status()).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.price).toBe(150);
    expect(updated.duration).toBe(45);
  });

  test("@API @P0 should delete service", async ({ request }) => {
    const createResponse = await request.post(`${baseURL}/api/v1/services`, {
      headers: {
        ServiceProviderID: tenantId,
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      data: {
        name: `Service-${Date.now()}`,
        duration: 30,
        price: 50,
      },
    });

    const service = await createResponse.json();
    testServiceId = service.id;

    const deleteResponse = await request.delete(
      `${baseURL}/api/v1/services/${service.id}`,
      {
        headers: {
          ServiceProviderID: tenantId,
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    expect([200, 204]).toContain(deleteResponse.status());

    const listResponse = await request.get(
      `${baseURL}/api/v1/services?status=active`,
      {
        headers: {
          ServiceProviderID: tenantId,
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    const services = await listResponse.json();
    const deleted = services.find((s: any) => s.id === service.id);
    expect(deleted).toBeFalsy();
  });
});
