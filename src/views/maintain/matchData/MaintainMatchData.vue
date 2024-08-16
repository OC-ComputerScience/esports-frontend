<script setup>
import { ref, onMounted } from "vue";

import MetricServices from "../../../services/metricServices.js";
import MatchServices from "../../../services/matchServices.js";

import ViewMatchData from "./ViewMatchData.vue";
import AddMatchData from "./AddMatchData.vue";

const currentTab = ref("1");

const props = defineProps({
  matchId: {
    type: Number,
    default: -1,
  },
});

const metrics = ref([]);
const match = ref({});

onMounted(async () => {
  var titleId;
  await MatchServices.getMatch(props.matchId).then((response) => {
    match.value = response.data;
    titleId = response.data.team.titleId;
  });

  MetricServices.getAllMatchMetricsForTitle(titleId).then((response) => {
    metrics.value = response.data.map((metric) => {
      return { name: metric.name, value: metric.id };
    });
  });
});

const switchCurrentTab = () => {
  if (currentTab.value == "1") {
    currentTab.value = "2";
  } else {
    currentTab.value = "1";
  }
};
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
  <v-col v-if="match.name" :cols="cols" class="mx-auto">
    <h1 class="mb-2">{{ match.name }} Match Data</h1>
    <v-card>
      <v-tabs v-model="currentTab" color="primary" dark slider-color="primary">
        <v-tab value="1"> View MatchData </v-tab>
        <v-tab value="2"> Add MatchData </v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="currentTab">
        <v-window-item value="1">
          <ViewMatchData :match-id="props.matchId" :metrics="metrics" />
        </v-window-item>

        <v-window-item value="2">
          <AddMatchData
            :match-id="props.matchId"
            :metrics="metrics"
            @cancel="switchCurrentTab"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </v-col>
</template>
<style scoped></style>
