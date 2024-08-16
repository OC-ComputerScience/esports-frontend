import apiClient from "./services.js";

export default {
  getPlayerChartData(aliasId, metricId) {
    return apiClient.get(`chartData/player/${aliasId}/metric/${metricId}`);
  },
};
