import apiClient from "./services";

export default {
  getMetric(metricId) {
    return apiClient.get(`/metrics/${metricId}`);
  },
  addMetric(metric) {
    return apiClient.post("/metrics/", metric);
  },
  updateMetric(id, metric) {
    return apiClient.put(`/metrics/${id}`, metric);
  },
  deleteMetric(id) {
    return apiClient.delete(`/metrics/${id}`);
  },
  getMetricsForTitle(titleId, pageSize, page) {
    return apiClient.get(
      `/metrics/title/${titleId}?pageSize=${pageSize}&page=${page}`,
    );
  },
  getAllMatchMetricsForTitle(titleId) {
    return apiClient.get(`/metrics/title/${titleId}/matchMetrics`);
  },
  getAllPlayerMetricsForTitle(titleId) {
    return apiClient.get(`/metrics/title/${titleId}/playerMetrics`);
  },
  getMetricTypes() {
    return apiClient.get("/metrics/values/metricTypes");
  },
  getDataTypes() {
    return apiClient.get("/metrics/values/dataTypes");
  },
  search(titleId, filter, pageSize, page) {
    return apiClient.get(
      `/metrics/title/${titleId}?filter=${filter}&pageSize=${pageSize}&page=${page}`,
    );
  },
};
