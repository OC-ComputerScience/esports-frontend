import apiClient from "./services.js";

export default {
  create(data) {
    return apiClient.post("/facility/stations", data);
  },

  update(id, data) {
    return apiClient.put(`/facility/stations/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/facility/stations/${id}`);
  },

  getAll() {
    return apiClient.get("/facility/stations");
  },

  getById(id) {
    return apiClient.get(`/facility/stations/${id}`);
  },
};
