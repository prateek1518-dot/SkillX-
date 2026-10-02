import apiClient from "./client.js";

export const authService = {
  async register(data) {
    const res = await apiClient.post("/auth/register", data);
    if (res.token) {
      apiClient.setToken(res.token);
    }
    return res;
  },

  async login(email, password) {
    const res = await apiClient.post("/auth/login", { email, password });
    if (res.token) {
      apiClient.setToken(res.token);
    }
    return res;
  },

  async getMe() {
    return await apiClient.get("/auth/me");
  },

  async getProfile() {
    return await apiClient.get("/users/profile");
  },

  async updateProfile(data) {
    return await apiClient.put("/users/profile", data);
  },

  async addSkill(type, skill) {
    return await apiClient.post("/users/skills", { type, skill });
  },

  async removeSkill(type, skill) {
    return await apiClient.delete("/users/skills", { type, skill });
  },

  logout() {
    apiClient.setToken(null);
  },
};

export default authService;
