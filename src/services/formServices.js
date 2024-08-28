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
  addFormVersion(formId, data) {
    return apiClient.post(`/forms/${formId}/versions`, data);
  },
  updateFormVersion(versionId, data) {
    return apiClient.put(`/forms/version/${versionId}`, data);
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
  getDirectorSignatureForms() {
    return apiClient.get("forms/director/signatureReq");
  },

  getSignedForm(userId, versionId) {
    var baseurl = "";
    if (import.meta.env.DEV) {
      baseurl = "http://localhost/EsportsAPI";
    } else {
      baseurl = "/EsportsAPI/";
    }

    return axios.get(`${baseurl}/forms/user/${userId}/form/${versionId}`, {
      headers: { Authorization: "yes" },
      responseType: "text",
    });
  },
  uploadFormFile(formVersionId, file, onProgressCallback) {
    var baseurl = "";
    if (import.meta.env.DEV) {
      baseurl = "http://localhost/EsportsAPI";
    } else {
      baseurl = "/EsportsAPI/";
    }
    let formData = new FormData();

    formData.append("file", file[0]);
    return axios.post(
      baseurl + `/forms/version/${formVersionId}/upload`,
      formData,
      {},
      onProgressCallback,
    );
  },
};
