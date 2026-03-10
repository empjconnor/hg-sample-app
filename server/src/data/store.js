/**
 * In-Memory Data Store
 * Simple storage for the training exercise - no database needed
 */

const { createCustomer, createTenant, createDefaultOnboardingSteps } = require('../models');

// In-memory storage
const store = {
  customers: [],
  tenants: [],
  onboardingStates: []
};

// Seed with example data
function seedData() {
  // Example customer - Acme Corporation
  const exampleCustomer = createCustomer({
    id: 'cust_001',
    name: 'Acme Corporation',
    industry: 'Manufacturing',
    region: 'North America',
    contactEmail: 'onboarding@acme.example.com',
    createdAt: '2025-01-15T10:00:00Z'
  });

  // Example tenant for Acme
  const exampleTenant = createTenant({
    id: 'tenant_001',
    customerId: 'cust_001',
    status: 'pending',
    plan: 'professional',
    createdAt: '2025-01-15T10:00:00Z'
  });

  // Example onboarding state - just started, nothing completed
  const exampleOnboardingState = {
    customerId: 'cust_001',
    steps: createDefaultOnboardingSteps(),
    progressPercent: 0
  };

  store.customers.push(exampleCustomer);
  store.tenants.push(exampleTenant);
  store.onboardingStates.push(exampleOnboardingState);
}

// Seed additional customers from sample data
function seedSampleCustomers() {
  const sampleCustomers = [
    createCustomer({
      id: 'cust_002',
      name: 'ABC Accounting',
      industry: 'Accounting',
      region: 'North America',
      contactEmail: 'onboarding@abcaccounting.example.com',
      createdAt: '2025-02-01T09:00:00Z'
    }),
    createCustomer({
      id: 'cust_003',
      name: 'XYZ Financial Services',
      industry: 'Financial Services',
      region: 'North America',
      contactEmail: 'setup@xyzfinancial.example.com',
      createdAt: '2025-02-10T14:00:00Z'
    }),
    createCustomer({
      id: 'cust_004',
      name: 'Premier Bookkeeping',
      industry: 'Accounting',
      region: 'United Kingdom',
      contactEmail: 'admin@premierbookkeeping.example.co.uk',
      createdAt: '2025-02-15T11:00:00Z'
    })
  ];

  const sampleTenants = [
    createTenant({ id: 'tenant_002', customerId: 'cust_002', status: 'pending', plan: 'professional' }),
    createTenant({ id: 'tenant_003', customerId: 'cust_003', status: 'pending', plan: 'enterprise' }),
    createTenant({ id: 'tenant_004', customerId: 'cust_004', status: 'pending', plan: 'starter' })
  ];

  sampleCustomers.forEach(c => store.customers.push(c));
  sampleTenants.forEach(t => store.tenants.push(t));

  sampleCustomers.forEach(c => {
    store.onboardingStates.push({
      customerId: c.id,
      steps: createDefaultOnboardingSteps(),
      progressPercent: 0
    });
  });
}

// Initialize with seed data
seedData();
seedSampleCustomers();

// Store access functions
function getCustomers() {
  return [...store.customers];
}

function getCustomerById(id) {
  return store.customers.find(c => c.id === id);
}

function addCustomer(customer) {
  store.customers.push(customer);
  return customer;
}

function updateCustomer(id, updates) {
  const index = store.customers.findIndex(c => c.id === id);
  if (index !== -1) {
    store.customers[index] = { ...store.customers[index], ...updates, id };
    return store.customers[index];
  }
  return null;
}

function getTenants() {
  return [...store.tenants];
}

function getTenantByCustomerId(customerId) {
  return store.tenants.find(t => t.customerId === customerId);
}

function addTenant(tenant) {
  store.tenants.push(tenant);
  return tenant;
}

function updateTenant(customerId, updates) {
  const index = store.tenants.findIndex(t => t.customerId === customerId);
  if (index !== -1) {
    store.tenants[index] = { ...store.tenants[index], ...updates, customerId };
    return store.tenants[index];
  }
  return null;
}

function getOnboardingState(customerId) {
  return store.onboardingStates.find(s => s.customerId === customerId);
}

function getAllOnboardingStates() {
  return [...store.onboardingStates];
}

function addOnboardingState(state) {
  store.onboardingStates.push(state);
  return state;
}

function updateOnboardingState(customerId, updates) {
  const index = store.onboardingStates.findIndex(s => s.customerId === customerId);
  if (index !== -1) {
    store.onboardingStates[index] = { ...store.onboardingStates[index], ...updates };
    return store.onboardingStates[index];
  }
  return null;
}

function updateOnboardingStepStatus(customerId, stepId, status) {
  const state = store.onboardingStates.find(s => s.customerId === customerId);
  if (!state) return null;
  const step = state.steps.find(s => s.id === stepId);
  if (!step) return null;
  step.status = status;
  return state;
}

module.exports = {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  getTenants,
  getTenantByCustomerId,
  addTenant,
  updateTenant,
  getOnboardingState,
  getAllOnboardingStates,
  addOnboardingState,
  updateOnboardingState,
  updateOnboardingStepStatus
};
