import apiClient from "./services.js";

export default {
  getMatch(matchId) {
    return apiClient.get("/match/" + matchId);
  },
  createMatch(data) {
    return apiClient.post("/match", data);
  },
  updateMatch(matchId, data) {
    return apiClient.put("/match/" + matchId, data);
  },
  deleteMatch(matchId) {
    return apiClient.delete("/match/" + matchId);
  },
  getAllMatches(pageSize, page) {
    return apiClient.get(`/match?pageSize=${pageSize}&page=${page}`);
  },
  search(filter, pageSize, page) {
    return apiClient.get(
      `/match?filter=${filter}&pageSize=${pageSize}&page=${page}`,
    );
  },
};
