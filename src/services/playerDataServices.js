import apiClient from "./services.js";

export default {
  createPlayerData(data) {
    return apiClient.post("/playerData", data);
  },
  getPlayerDataById(id) {
    return apiClient.get(`/playerData/${id}`);
  },
  updatePlayerData(id, data) {
    return apiClient.put(`/playerData/${id}`, data);
  },
  deletePlayerData(id) {
    return apiClient.delete(`/playerData/${id}`);
  },
  getAllForParticipant(participantId, page, pageSize) {
    return apiClient.get(
      `/playerData/participant/${participantId}?page=${page}&pageSize=${pageSize}`,
    );
  },
  searchParticipantData(participantId, page, pageSize, filter) {
    return apiClient.get(
      `/playerData/participant/${participantId}?page=${page}&pageSize=${pageSize}&filter=${filter}`,
    );
  },
};
