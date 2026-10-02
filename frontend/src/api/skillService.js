import apiClient from "./client.js";

export const skillService = {
  async getSkills(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.limit) query.append("limit", params.limit);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return await apiClient.get(`/skills${qs}`);
  },

  async getSkillById(id) {
    return await apiClient.get(`/skills/${id}`);
  },

  async createSkill(data) {
    return await apiClient.post("/skills", data);
  },

  async deleteSkill(id) {
    return await apiClient.delete(`/skills/${id}`);
  },
};

export default skillService;
