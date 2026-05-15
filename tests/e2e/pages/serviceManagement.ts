/**
 * Service Management Page Object
 * Handles all interactions and locators for service management UI
 */

import { Page, Locator } from "@playwright/test";

interface CreateServiceData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  color?: string;
  internal?: boolean;
  onlineBookable?: boolean;
  minNotice?: number;
}

interface UpdateServiceData {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  color?: string;
  internal?: boolean;
  onlineBookable?: boolean;
  minNotice?: number;
}

export class ServiceManagementPage {
  readonly page: Page;

  // Navigation
  readonly servicesMenuLink: Locator;

  // Service List
  readonly servicesList: Locator;
  readonly serviceItem: Locator;
  readonly serviceNameCell: Locator;
  readonly createServiceBtn: Locator;
  readonly searchInput: Locator;

  // Create/Edit Form
  readonly serviceNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly durationInput: Locator;
  readonly priceInput: Locator;
  readonly colorInput: Locator;
  readonly internalToggle: Locator;
  readonly onlineBookableToggle: Locator;
  readonly minNoticeInput: Locator;
  readonly transitionBeforeInput: Locator;
  readonly transitionAfterInput: Locator;
  readonly categorySelect: Locator;

  // Buttons
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;
  readonly deleteBtn: Locator;
  readonly editBtn: Locator;

  // Assignments
  readonly providersTab: Locator;
  readonly locationsTab: Locator;
  readonly resourcesTab: Locator;
  readonly formsTab: Locator;
  readonly addProviderBtn: Locator;
  readonly addLocationBtn: Locator;
  readonly assignedProvidersList: Locator;
  readonly assignedLocationsList: Locator;

  // Messages
  readonly successToast: Locator;
  readonly errorMessage: Locator;
  readonly noDataMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.servicesMenuLink = page.locator(".menu").getByText("Services");

    // Service List
    this.servicesList = page.locator(".services-list");
    this.serviceItem = page.locator(".service-item");
    this.serviceNameCell = this.serviceItem.locator(".service-name");
    this.createServiceBtn = page.getByRole("button", {
      name: "Create Service",
    });
    this.searchInput = page.getByPlaceholder("Search services...");

    // Create/Edit Form
    this.serviceNameInput = page.getByPlaceholder("Enter Service Name");
    this.descriptionInput = page.getByPlaceholder("Enter Description");
    this.durationInput = page.getByPlaceholder("Duration (minutes)");
    this.priceInput = page.getByPlaceholder("Price");
    this.colorInput = page.getByPlaceholder("Color");
    this.internalToggle = page.locator('[data-testid="toggle-internal"]');
    this.onlineBookableToggle = page.locator(
      '[data-testid="toggle-online-bookable"]',
    );
    this.minNoticeInput = page.locator('[data-testid="input-min-notice"]');
    this.transitionBeforeInput = page.locator(
      '[data-testid="input-transition-before"]',
    );
    this.transitionAfterInput = page.locator(
      '[data-testid="input-transition-after"]',
    );
    this.categorySelect = page.locator('[data-testid="select-category"]');

    // Buttons
    this.saveBtn = page.getByRole("button", { name: "Save" });
    this.cancelBtn = page.getByRole("button", { name: "Cancel" });
    this.deleteBtn = page.getByRole("button", { name: "Delete" });
    this.editBtn = page.getByRole("button", { name: "Edit" });

    // Assignments
    this.providersTab = page.locator(".tab").getByText("Providers");
    this.locationsTab = page.locator(".tab").getByText("Locations");
    this.resourcesTab = page.locator(".tab").getByText("Resources");
    this.formsTab = page.locator(".tab").getByText("Forms");
    this.addProviderBtn = page.getByRole("button", { name: "Add Provider" });
    this.addLocationBtn = page.getByRole("button", { name: "Add Location" });
    this.assignedProvidersList = page.locator(".provider-list");
    this.assignedLocationsList = page.locator(".assigned-locations-list");

    // Messages
    this.successToast = page.locator(".toast-success");
    this.errorMessage = page.locator(".error-message");
    this.noDataMessage = page.locator(".no-data");
  }

  // Navigation
  async navigateToServices() {
    await this.page.goto("/admin/services");
    await this.page.waitForLoadState("networkidle");
  }

  // Service Management
  async openCreateServiceForm() {
    await this.createServiceBtn.click();
    await this.page.waitForLoadState("networkidle");
  }

  async fillCreateServiceForm(createServiceData: CreateServiceData) {
    await this.serviceNameInput.fill(createServiceData.name);

    if (createServiceData.description) {
      await this.descriptionInput.fill(createServiceData.description);
    }

    await this.durationInput.fill(createServiceData.duration.toString());
    await this.priceInput.fill(createServiceData.price.toString());

    if (createServiceData.color) {
      await this.colorInput.fill(createServiceData.color);
    }

    if (createServiceData.internal) {
      await this.internalToggle.click();
    }

    if (createServiceData.onlineBookable) {
      await this.onlineBookableToggle.click();
      if (createServiceData.minNotice) {
        await this.minNoticeInput.fill(createServiceData.minNotice.toString());
      }
    }
  }

  async updateServiceForm(updateServiceData: UpdateServiceData) {
    if (updateServiceData.name) {
      await this.serviceNameInput.fill(updateServiceData.name);
    }

    if (updateServiceData.description) {
      await this.descriptionInput.fill(updateServiceData.description);
    }
    if (updateServiceData.duration) {
      await this.durationInput.fill(updateServiceData.duration.toString());
    }
    if (updateServiceData.price) {
      await this.priceInput.fill(updateServiceData.price.toString());
    }

    if (updateServiceData.color) {
      await this.colorInput.fill(updateServiceData.color);
    }

    if (updateServiceData.internal) {
      await this.internalToggle.click();
    }

    if (updateServiceData.onlineBookable) {
      await this.onlineBookableToggle.click();
      if (updateServiceData.minNotice) {
        await this.minNoticeInput.fill(updateServiceData.minNotice.toString());
      }
    }
  }

  async saveService() {
    await this.saveBtn.click();
    await this.page.waitForLoadState("networkidle");
  }

  async createService(createServiceData: CreateServiceData) {
    await this.openCreateServiceForm();
    await this.fillCreateServiceForm(createServiceData);
    await this.saveService();
  }

  async deleteService(serviceName: string) {
    const row = this.page.locator(`[data-service="${serviceName}"]`);
    await row.locator(this.deleteBtn).click();
    await this.page
      .getByRole("dialog")
      .getByRole("button", { name: "Confirm" })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async editService(serviceName: string, updates: UpdateServiceData) {
    const row = this.page.locator(`[data-service="${serviceName}"]`);
    await row.locator(this.editBtn).click();
    await this.page.waitForLoadState("networkidle");

    await this.updateServiceForm(updates);
    await this.saveService();
  }

  // Search & Filter
  async searchService(name: string) {
    await this.searchInput.fill(name);
    await this.page.keyboard.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  async getServiceDataByName(name: string): Promise<{
    serviceName: string;
    description: string;
    duration: string;
    price: string;
  }> {
    const item = this.page.locator(`[data-service="${name}"]`);
    await item.click();
    const serviceName = await item.locator(".service-name").textContent();
    const description = await item
      .locator(".service-description")
      .textContent();
    const duration = await item.locator(".service-duration").textContent();
    const price = await item.locator(".service-price").textContent();

    return {
      serviceName: serviceName ? serviceName.trim() : "",
      description: description ? description.trim() : "",
      duration: duration ? duration.trim() : "",
      price: price ? price.trim() : "",
    };
  }

  // Provider Assignment
  async openProvidersTab() {
    await this.providersTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async addProvider(providerName: string) {
    await this.addProviderBtn.click();
    const modal = this.page
      .getByRole("dialog")
      .filter({ hasText: "Select Providers" });
    await modal.locator(`[data-provider="${providerName}"]`).click();
    await this.page
      .getByRole("dialog")
      .getByRole("button", { name: "Confirm" })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async isProviderAssigned(providerName: string): Promise<boolean> {
    return await this.assignedProvidersList
      .locator(`[data-provider="${providerName}"]`)
      .isVisible()
      .catch(() => false);
  }

  // Location Assignment
  async openLocationsTab() {
    await this.locationsTab.click();
    await this.page.waitForLoadState("networkidle");
  }

  async addLocation(locationName: string) {
    await this.addLocationBtn.click();
    const modal = this.page
      .getByRole("dialog")
      .filter({ hasText: "Select Location" });
    await modal.locator(`[data-location="${locationName}"]`).click();
    await this.page
      .getByRole("dialog")
      .getByRole("button", { name: "Confirm" })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async isLocationAssigned(locationName: string): Promise<boolean> {
    return await this.assignedLocationsList
      .locator(`[data-location="${locationName}"]`)
      .isVisible()
      .catch(() => false);
  }

  // Assertions
  async isServiceVisible(name: string): Promise<boolean> {
    return await this.serviceNameCell
      .locator(`text=${name}`)
      .isVisible()
      .catch(() => false);
  }

  async getSuccessMessage(): Promise<string> {
    const sucessMessage = await this.successToast.textContent();
    return sucessMessage ? sucessMessage.trim() : "";
  }

  async getErrorMessage(): Promise<string> {
    const errorMessage = await this.errorMessage.textContent();
    return errorMessage ? errorMessage.trim() : "";
  }

  async waitForServiceToAppear(name: string, timeout = 10000) {
    await this.page
      .getByText(name, { exact: true })
      .waitFor({ state: "visible", timeout });
  }

  async getServiceCount(): Promise<number> {
    return await this.serviceItem.count();
  }
}
