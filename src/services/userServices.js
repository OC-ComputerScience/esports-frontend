import apiClient from "./services";

export default {
  /*-- General User Information --*/
  createUser(user) {
    console.log(user);
    return apiClient.post("user/", user);
  },
  updateUser(userId, user) {
    return apiClient.put("user/" + userId, user);
  },
  getUser(userId) {
    return apiClient.get("user/" + userId);
  },
  getAll(pageSize, page) {
    return apiClient.get(`/user?pageSize=${pageSize}&page=${page}`);
  },

  search(filter, pageSize, page) {
    return apiClient.get(
      `/user?filter=${filter}&pageSize=${pageSize}&page=${page}`,
    );
  },
  getUserByEmail(email) {
    return apiClient.get("user?email=" + email);
  },
  getClassifications() {
    return apiClient.get("user/classifications");
  },

  /*-- Emergency Contacts --*/
  addEmergencyContact(userId, contact) {
    return apiClient.post(`/user/${userId}/emergencyContacts/`, contact);
  },
  updateEmergencyContact(userId, contact) {
    return apiClient.put(
      `/user/${userId}/emergencyContacts/${contact.id}`,
      contact,
    );
  },
  getEmergencyContacts(userId) {
    return apiClient.get(`/user/${userId}/emergencyContacts/`);
  },
};
