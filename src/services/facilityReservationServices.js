import apiClient from "./services.js";

export default {
  create(data) {
    return apiClient.post("/facility/reservations", data);
  },

  update(id, data) {
    return apiClient.put(`/facility/reservations/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/facility/reservations/${id}`);
  },

  getAllByFacilityStationId(facilityStationId) {
    return apiClient.get(`/facility/reservations/station/${facilityStationId}`);
  },

  getAllByDate(data) {
    return apiClient.post(`/facility/reservations/station/date`, data);
  },

  getById(id) {
    return apiClient.get(`/facility/reservations/${id}`);
  },
};
