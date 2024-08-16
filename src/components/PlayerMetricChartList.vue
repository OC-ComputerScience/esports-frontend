<script setup>
import { onMounted, ref } from "vue";
import MetricServices from "../services/metricServices.js";

import PlayerMetricChart from "./Charts/PlayerMetricChart.vue";

const props = defineProps({
  aliasId: {
    type: Number,
    default: -1,
  },
  titleId: {
    type: Number,
    default: -1,
  },
});

const metrics = ref([]);
const page = ref(1);
const pageMetrics = ref([]);

const getMetrics = async () => {
  await MetricServices.getAllPlayerMetricsForTitle(props.titleId)
    .then((response) => {
      metrics.value = response.data;
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const updatePageMetrics = () => {
  console.log("Here");
  const offset = page.value - 1;
  pageMetrics.value = metrics.value.slice(offset, offset + 1);
  console.log(offset);
};

onMounted(async () => {
  await getMetrics();
  pageMetrics.value = metrics.value.slice(0, 1);
  console.log(pageMetrics.value, metrics.value);
});
</script>

<template>
  <v-card>
    <v-col>
      <PlayerMetricChart
        v-for="metric in pageMetrics"
        :key="metric.id"
        :metric-id="metric.id"
        :alias-id="props.aliasId"
      />
      <v-pagination
        v-model="page"
        :length="metrics.length"
        class="pb-2"
        @update:model-value="updatePageMetrics"
      ></v-pagination>
    </v-col>
  </v-card>
</template>
