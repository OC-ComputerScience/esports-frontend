<script setup>
import { onMounted, ref } from "vue";

import ViewMetrics from "./ViewTitleMetrics.vue";
import AddMetric from "./AddTitleMetric.vue";

import MetricServices from "../../../services/metricServices";
import TitleServices from "../../../services/titleServices";

const props = defineProps({
  titleId: {
    type: Number,
    default: -1,
  },
});

const title = ref({});
const currentTab = ref("1");

const metricTypes = ref([]);
const dataTypes = ref([]);

onMounted(async () => {
  MetricServices.getDataTypes().then((response) => {
    dataTypes.value = response.data;
    console.log(response.data);
  });
  MetricServices.getMetricTypes().then((response) => {
    metricTypes.value = response.data;
  });
  TitleServices.getTitle(props.titleId).then((response) => {
    title.value = response.data;
  });
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
  <v-col v-if="title.name" :cols="cols" class="mx-auto">
    <h1 class="mb-2">{{ title.name }} Metrics</h1>
    <v-card>
      <v-tabs v-model="currentTab" color="primary" dark slider-color="primary">
        <v-tab value="1"> View Metrics </v-tab>
        <v-tab value="2"> Add Metric </v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="currentTab">
        <v-window-item value="1">
          <ViewMetrics
            :title-id="props.titleId"
            :data-types="dataTypes"
            :metric-types="metricTypes"
          />
        </v-window-item>

        <v-window-item value="2">
          <AddMetric
            :title-id="props.titleId"
            :data-types="dataTypes"
            :metric-types="metricTypes"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </v-col>
</template>
<style scoped></style>
