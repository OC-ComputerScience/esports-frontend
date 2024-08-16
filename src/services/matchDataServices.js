import apiClient from "./services";

export default {
  getMatchData(id) {
    return apiClient.get(`/matchData/${id}`);
  },
  addMatchData(matchData) {
    return apiClient.post("/matchData/", matchData);
  },
  updateMatchData(id, matchData) {
    return apiClient.put(`/matchData/${id}`, matchData);
  },
  deleteMatchData(id) {
    return apiClient.delete(`/matchData/${id}`);
  },
  getMatchDataForMatch(matchId, pageSize, page) {
    return apiClient.get(
      `/matchData/match/${matchId}?pageSize=${pageSize}&page=${page}`,
    );
  },
  search(matchId, filter, pageSize, page) {
    return apiClient.get(
      `/matchData/match/${matchId}?filter=${filter}&pageSize=${pageSize}&page=${page}`,
    );
  },
};
