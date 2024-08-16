import apiClient from "./services.js";

export default {
  getAllForUser(userId) {
    return apiClient.get(`/alias/${userId}/alias`);
  },
  getAllForTeam(teamId) {
    return apiClient.get(`/alias/team/${teamId}`);
  },
  getPrimaryAlias(userId) {
    return apiClient.get(`alias/${userId}/alias?type=primary`);
  },
  create(data, userId) {
    return apiClient.post("/alias/" + userId + "/alias", data);
  },
  update(userId, aliasId, data) {
    return apiClient.put("/alias/" + userId + "/alias/" + aliasId, data);
  },
  deleteOne(userId, aliasId) {
    return apiClient.delete("/alias/" + userId + "/alias/" + aliasId);
  },
};
