<script setup>
import { ref } from "vue";

import ViewTitles from "./ViewTitles.vue";
import AddTitle from "./AddTitle.vue";

const currentTab = ref("1");
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
        <v-tab value="1"> View Titles </v-tab>
        <v-tab value="2"> Add Title </v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="currentTab">
        <v-window-item value="1">
          <ViewTitles />
        </v-window-item>

        <v-window-item value="2">
          <AddTitle />
        </v-window-item>
      </v-window>
    </v-card>
  </v-col>
</template>
<style scoped></style>
