import apiClient from "./services";
import axios from "axios";

export default {
  getAllForms() {
    return apiClient.get("/forms");
  },
  getFormById(id) {
    return apiClient.get(`/forms/${id}`);
  },
  createForm(data) {
    return apiClient.post("/forms", data);
  },
  updateForm(id, data) {
    return apiClient.put(`/forms/${id}`, data);
  },
  deleteForm(id) {
    return apiClient.delete(`/forms/${id}`);
  },
  getFormVersionById(versionId) {
    return apiClient.get(`/forms/version/${versionId}`);
  },
  getFormVersions(formId) {
    return apiClient.get(`/forms/${formId}/versions`);
  },
  getTestForm() {
    return apiClient.get(`/forms/user/1/testForm/2`);
  },
  getSignedForm(userId, versionId) {
    return axios.get(
      `http://localhost/EsportsAPI/forms/user/${userId}/form/${versionId}`,
      {
        headers: { Authorization: "yes" },
        responseType: "text",
      },
    );
  },
  getDirectorSignatureForms() {
    return apiClient.get("forms/director/signatureReq");
  },
};
