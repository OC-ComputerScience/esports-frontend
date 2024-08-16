import apiClient from "./services"; // Assuming you have an apiClient configured

export default {
  getAllFormSignatures() {
    return apiClient.get("/formSignatures");
  },
  getFormSignatureById(id) {
    return apiClient.get(`/formSignatures/${id}`);
  },
  createFormSignature(data) {
    return apiClient.post("/formSignatures", data);
  },
  directorFormSignature(id, data) {
    return apiClient.post(`/formSignatures/${id}/director`, data);
  },
  updateFormSignature(id, data) {
    return apiClient.put(`/formSignatures/${id}`, data);
  },
  deleteFormSignature(id) {
    return apiClient.delete(`/formSignatures/${id}`);
  },
  getMostRecentForUser(userId) {
    return apiClient.get(`/formSignatures/user/${userId}`);
  },
  getFormSignaturesByFormVersionId(formVersionId) {
    return apiClient.get(`/formSignatures/version/${formVersionId}`);
  },
  getDirectorUnsigned(formVersionId) {
    return apiClient.get(
      `/formSignatures/version/${formVersionId}?directorUnsigned=true`,
    );
  },
};
