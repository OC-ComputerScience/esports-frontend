import apiClient from "./services";

export default {
  getTitle(titleId) {
    return apiClient.get(`/titles/${titleId}`);
  },
  updateTitle(titleId, updatedTitle) {
    return apiClient.put(`/titles/${titleId}`, updatedTitle);
  },
  deleteTitle(titleId) {
    return apiClient.delete(`/titles/${titleId}`);
  },
  getTitles(pageSize, page) {
    return apiClient.get(`/titles?pageSize=${pageSize}&page=${page}`);
  },
  addTitle(title) {
    return apiClient.post("/titles/", title);
  },
  search(filter, pageSize, page) {
    return apiClient.get(
      `/titles?filter=${filter}&pageSize=${pageSize}&page=${page}`,
    );
  },
  getAllTitles() {
    return apiClient.get("/titles/all/raw");
  },
};
