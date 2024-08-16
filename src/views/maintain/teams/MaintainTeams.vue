<script setup>
import { ref, onMounted } from "vue";

import TitleServices from "../../../services/titleServices.js";
import ViewTeams from "./ViewTeams.vue";
import AddTeam from "./AddTeam.vue";

const currentTab = ref("1");
const titles = ref([]);

const getTitles = async () => {
  console.log("Hello");
  await TitleServices.getTitles(0, 0).then((response) => {
    titles.value = response.data.map((title) => {
      return { name: title.name, value: title.id };
    });
  });
};

onMounted(() => {
  getTitles();
});
</script>

<script>
export default {
  computed: {
    cols() {
      const { xs, sm } = this.$vuetify.display;
      return xs ? 12 : sm ? 10 : 8;
    },
  },
};
</script>

<template>
  <v-col :cols="cols" class="mx-auto">
    <v-card>
      <v-tabs v-model="currentTab" color="primary" dark slider-color="primary">
        <v-tab value="1"> View Teams </v-tab>
        <v-tab value="2"> Add Team </v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="currentTab">
        <v-window-item value="1">
          <ViewTeams :titles="titles" />
        </v-window-item>

        <v-window-item value="2">
          <AddTeam :titles="titles" />
        </v-window-item>
      </v-window>
    </v-card>
  </v-col>
</template>
<style scoped></style>
