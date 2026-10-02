import apiClient from "./client.js";

export const certificateService = {
  async getCertificates() {
    return await apiClient.get("/certificates");
  },

  async getCertificate(id) {
    return await apiClient.get(`/certificates/${id}`);
  },

  async issueCertificate(data) {
    return await apiClient.post("/certificates", data);
  },
};

export default certificateService;
