import { test, expect } from "@playwright/test";

test.describe("Service Management - API", () => {
  let baseURL: string;
  let tenantId: string;
  let testServiceId: string;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    baseURL = "https://yocale-test.staging.com";

    // Login as tenant admin to get auth token
    const adminEmail = process.env.VALID_ADMIN_EMAIL;
    const adminPassword = process.env.VALID_ADMIN_PASSWORD;

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

  test("@API @P0 S-1: should create service with only required fields", async ({
    request,
  }) => {});

  test("@API @P0 S-1: should create service with required fields plus optional fields", async ({
    request,
  }) => {});

  test("@API @P0 S-1: should attempt to create service with missing required fields", async ({
    request,
  }) => {});

  test("@API @P0 S-1: should create service with invalid data", async ({
    request,
  }) => {});

  test("@API @P0 S-1: should verify service appears in API service list immediately after creation", async ({
    request,
  }) => {});

  test("@API @P0 S-2: should update required fields", async ({
    request,
  }) => {});

  test("@API @P0 S-2: should update optional fields", async ({
    request,
  }) => {});

  test("@API @P0 S-2: should attempt to update with invalid data", async ({
    request,
  }) => {});

  test("@API @P0 S-2: should verify existing bookings retain original values post-update", async ({
    request,
  }) => {});

  test("@API @P0 S-2: should confirm future booking simulations use updated values", async ({
    request,
  }) => {});

  test("@API @P0 S-3: should delete service", async ({ request }) => {});

  test("@API @P0 S-3: should attempt to delete non-existent service", async ({
    request,
  }) => {});

  test("@API @P0 S-3: should verify existing bookings still reference the deleted service", async ({
    request,
  }) => {});

  test("@API @P0 S-3: should check if deactivation is supported and behaves similarly", async ({
    request,
  }) => {});

  test("@API @P0 S-3: should confirm deleted service does not appear in booking-related endpoints", async ({
    request,
  }) => {});

  test("@API @P0 S-4: should assign single provider to service", async ({
    request,
  }) => {});

  test("@API @P0 S-4: should assign multiple providers", async ({
    request,
  }) => {});

  test("@API @P0 S-4: should unassign provider", async ({ request }) => {});

  test("@API @P0 S-4: should verify booking widget API only returns assigned providers", async ({
    request,
  }) => {});

  test("@API @P0 S-4: should confirm unassignment does not affect existing appointments", async ({
    request,
  }) => {});

  test("@API @P0 S-5: should assign service to single location", async ({
    request,
  }) => {});

  test("@API @P0 S-5: should assign to multiple locations", async ({
    request,
  }) => {});

  test("@API @P0 S-5: should unassign from location", async ({
    request,
  }) => {});

  test("@API @P0 S-5: should query booking widget by location and ensure only assigned services appear", async ({
    request,
  }) => {});

  test("@API @P0 S-5: should verify unassignment does not affect existing bookings at that location", async ({
    request,
  }) => {});

  test("@API @P0 S-6: should attach single resource to service", async ({
    request,
  }) => {});

  test("@API @P0 S-6: should attach multiple resources", async ({
    request,
  }) => {});

  test("@API @P0 S-6: should detach resource", async ({ request }) => {});

  test("@API @P0 S-6: should attempt booking when all resources are available", async ({
    request,
  }) => {});

  test("@API @P0 S-6: should attempt booking when a required resource is unavailable", async ({
    request,
  }) => {});

  test("@API @P0 S-7: should attach form as required-per-appointment", async ({
    request,
  }) => {});

  test("@API @P0 S-7: should attach form as required-per-client", async ({
    request,
  }) => {});

  test("@API @P0 S-7: should attempt booking without completing required form", async ({
    request,
  }) => {});

  test("@API @P0 S-7: should complete form and verify booking succeeds", async ({
    request,
  }) => {});

  test("@API @P0 S-7: should detach form", async ({ request }) => {});

  test("@API @P0 S-8: should enable online booking", async ({ request }) => {});

  test("@API @P0 S-8: should set minimum notice rule", async ({
    request,
  }) => {});

  test("@API @P0 S-8: should set time window restrictions", async ({
    request,
  }) => {});

  test("@API @P0 S-8: should disable online booking", async ({
    request,
  }) => {});

  test("@API @P0 S-8: should test combinations of rules", async ({
    request,
  }) => {});

  test("@API @P0 S-9: should assign service to category", async ({
    request,
  }) => {});

  test("@API @P0 S-9: should set display order for services within category", async ({
    request,
  }) => {});

  test("@API @P0 S-9: should change category", async ({ request }) => {});

  test("@API @P0 S-9: should query booking widget and verify services appear in configured order", async ({
    request,
  }) => {});

  test("@API @P0 S-9: should test multiple categories and ordering across them", async ({
    request,
  }) => {});
});
