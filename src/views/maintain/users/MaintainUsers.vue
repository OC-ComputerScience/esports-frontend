<script setup>
import { ref } from "vue";

import ViewUsers from "./ViewUsers.vue";
import AddAccount from "./AddAccount.vue";

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
        <v-tab value="1"> View Users </v-tab>
        <v-tab value="2"> Add User </v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="currentTab">
        <v-window-item value="1">
          <ViewUsers />
        </v-window-item>

        <v-window-item value="2">
          <AddAccount />
        </v-window-item>
      </v-window>
    </v-card>
  </v-col>
</template>
