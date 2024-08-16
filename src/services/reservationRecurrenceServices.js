import apiClient from "./services.js";

export default {
  create(data) {
    return apiClient.post("/facility/reservationRecurrence", data);
  },

  update(id, data) {
    return apiClient.put(`/facility/reservationRecurrence/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/facility/reservationRecurrence/${id}`);
  },

  getAll() {
    return apiClient.get("/facility/reservationRecurrence");
  },

  getById(id) {
    return apiClient.get(`/facility/reservationRecurrence/${id}`);
  },

  getByReservationId(reservationId) {
    return apiClient.get(
      `/facility/reservationRecurrence/reservation/${reservationId}`,
    );
  },
};
