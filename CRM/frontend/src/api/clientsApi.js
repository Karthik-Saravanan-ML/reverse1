import apiClient from './client';

const clientsApi = {
  getClients: async (params = {}) => {
    const response = await apiClient.get('/clients/organizations', {
      params: { size: 100, ...params },
    });
    const organizations = Array.isArray(response.data)
      ? response.data
      : response.data.content;

    return organizations.map((organization) => ({
      ...organization,
      companyName: organization.name,
    }));
  },
};

export default clientsApi;
