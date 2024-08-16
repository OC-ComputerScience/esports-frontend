<script setup>
import UserDashboard from "../components/Dashboards/UserDashboard.vue";
import DirectorDashboard from "../components/Dashboards/DirectorDashboard.vue";

import UserRoleServices from "../services/userRoleServices";
import Utils from "../config/utils";
import { ref, onMounted } from "vue";

const userRoles = ref([]);
const rolesLoaded = ref(false);

const getUserRoles = () => {
  const user = Utils.getStore("user");
  UserRoleServices.getAllRolesForUser(user.userId).then((response) => {
    const mappedRoles = response.data.map((currentRole) => {
      return currentRole.role.type;
    });
    userRoles.value = mappedRoles;
    rolesLoaded.value = true;
  });
};

onMounted(() => {
  getUserRoles();
});
</script>

<template>
  <div v-if="rolesLoaded">
    <DirectorDashboard v-if="userRoles.includes('Director')" />
    <UserDashboard v-else />
  </div>
</template>
