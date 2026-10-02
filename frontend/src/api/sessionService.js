import apiClient from "./client.js";

export const sessionService = {
  async getSessions() {
    return await apiClient.get("/sessions");
  },

  async createSession(data) {
    return await apiClient.post("/sessions", data);
  },

  async updateSession(id, data) {
    return await apiClient.patch(`/sessions/${id}`, data);
  },
};

export default sessionService;
