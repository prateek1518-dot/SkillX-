import apiClient from "./client.js";

export const requestService = {
  async getRequests() {
    return await apiClient.get("/requests");
  },

  async createRequest(data) {
    return await apiClient.post("/requests", data);
  },

  async updateRequestStatus(id, status) {
    return await apiClient.patch(`/requests/${id}`, { status });
  },
};

export default requestService;
