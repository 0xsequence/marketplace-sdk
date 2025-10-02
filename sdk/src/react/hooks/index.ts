// Re-export all hooks from their new organized locations
// This maintains backwards compatibility while providing better organization

// Configuration & context hooks
export * from './config';
// Contract hooks
export * from './contracts';
// Data fetching hooks
export * from './data';
// Inventory hooks
export * from './data/inventory';
// Transaction hooks
export * from './transactions';

// UI state hooks
export * from './ui';
// Utility hooks
export * from './utils';
// Validation hooks
export * from './validation';
