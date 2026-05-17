import { createApiInstance, createApiService } from './baseApi';

/**
 * Department API Service
 * Handles department-related API operations
 */

const departmentsApi = createApiInstance();
const departmentsService = createApiService('departments', departmentsApi);

export const createDepartment = async (token, departmentData) => {
  return departmentsService.create(token, departmentData);
};

export const getDepartments = async (token) => {
  return departmentsService.getAll(token);
};

export const getDepartmentById = async (token, departmentId) => {
  return departmentsService.getById(token, departmentId);
};

export const updateDepartment = async (token, departmentId, departmentData) => {
  return departmentsService.update(token, departmentId, departmentData);
};

export const deleteDepartment = async (token, departmentId) => {
  return departmentsService.delete(token, departmentId);
};
