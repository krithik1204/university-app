# API Services Architecture

This document describes the reusable API architecture used in the application.

## Overview

The API services follow a layered architecture with reusable base utilities to ensure consistency, maintainability, and code reusability across all API operations.

## Architecture Layers

### 1. Base API Layer (`baseApi.js`)

The foundation layer provides reusable utilities for all API services:

#### Core Functions

- **`createApiInstance(config)`** - Creates configured axios instances
- **`setAuthToken(apiInstance, token)`** - Sets authorization headers
- **`handleApiError(error, operation)`** - Standardized error handling
- **`validateResponse(response, operation)`** - Response validation
- **`executeApiCall(apiCall, operation)`** - Wrapper for API calls with error handling
- **`createApiService(resourceName, apiInstance)`** - Creates CRUD service for any resource

#### Usage Example

```javascript
import { createApiInstance, createApiService } from './baseApi';

const apiInstance = createApiInstance();
const service = createApiService('products', apiInstance);

// Now you have full CRUD operations:
// service.getAll(token)
// service.getById(token, id)
// service.create(token, data)
// service.update(token, id, data)
// service.delete(token, id)
```

### 2. Resource-Specific API Layer

Each resource (users, roles, etc.) has its own API file that:

- Uses the base utilities for consistency
- Implements resource-specific business logic
- Provides clear, documented interfaces

#### Example Structure

```javascript
import { createApiInstance, createApiService } from './baseApi';

// Create resource-specific instance
const resourceApi = createApiInstance();
const resourceService = createApiService('resourceName', resourceApi);

// Export resource-specific functions
export const getResourceData = async (token) => {
  return resourceService.getAll(token);
};

// Export base service for advanced usage
export { resourceService };
```

## Benefits

### 1. **Code Reusability**
- Common patterns abstracted into reusable functions
- New API services can be created in minutes
- Consistent error handling across all services

### 2. **Maintainability**
- Single source of truth for API configuration
- Centralized error handling logic
- Easy to update common behavior

### 3. **Consistency**
- All services follow the same patterns
- Standardized error messages and handling
- Uniform API interfaces

### 4. **Extensibility**
- Easy to add new resources
- Simple to extend with new HTTP methods
- Flexible configuration options

## Creating New API Services

To create a new API service for a resource (e.g., "products"):

1. **Create the API file** (`productsApi.js`):

```javascript
import { createApiInstance, createApiService } from './baseApi';

const productsApi = createApiInstance();
const productsService = createApiService('products', productsApi);

export const getProducts = async (token) => {
  return productsService.getAll(token);
};

export const getProductById = async (token, productId) => {
  return productsService.getById(token, productId);
};

export const createProduct = async (token, productData) => {
  return productsService.create(token, productData);
};

export const updateProduct = async (token, productId, productData) => {
  return productsService.update(token, productId, productData);
};

export const deleteProduct = async (token, productId) => {
  return productsService.delete(token, productId);
};

// Custom methods for specific business logic
export const getProductsByCategory = async (token, categoryId) => {
  // Custom implementation
};

export { productsService };
```

2. **Use in components**:

```javascript
import { getProducts, createProduct } from '../resource/productsApi';

// Use the functions in your components
const products = await getProducts(token);
```

## Error Handling

All API functions use consistent error handling:

- **Network errors**: "Network error - please check your connection"
- **Server errors**: Server-provided error messages
- **Validation errors**: "Invalid response from server"
- **Generic errors**: "An unexpected error occurred"

## Best Practices

1. **Always use the base utilities** for new API services
2. **Document all exported functions** with JSDoc comments
3. **Handle errors appropriately** in components (don't just console.log)
4. **Use TypeScript** for better type safety (when possible)
5. **Test API functions** thoroughly
6. **Keep business logic** in services, not components

## Migration Guide

When adding new API endpoints:

1. Check if the base service covers your needs
2. If not, add custom methods to the resource API file
3. Always use the error handling utilities
4. Update this documentation if new patterns emerge