import { createApiInstance, createApiService } from './baseApi';

/**
 * Faculty API Service
 * Provides methods to create and fetch faculty records
 */

const facultyApi = createApiInstance();
const facultyService = createApiService('faculties', facultyApi);

export const createFaculty = async (token, facultyData) => {
  return facultyService.create(token, facultyData);
};

export const getFaculties = async (token) => {
  return facultyService.getAll(token);
};

export { facultyService };
