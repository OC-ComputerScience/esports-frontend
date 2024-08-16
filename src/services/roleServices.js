import apiClient from "./services.js";

export default {
  getAllRoles() {
    return apiClient.get("role");
  },
  createRole(role) {
    return apiClient.post("role", role);
  },
  getRole(id) {
    return apiClient.get("role/" + id);
  },
  deleteRole(id) {
    return apiClient.delete("role/" + id);
  },
};
