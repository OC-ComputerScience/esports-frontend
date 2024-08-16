<script setup>
import { onMounted, ref } from "vue";

import MetricChart from "./MetricChart.vue";
import MetricServices from "../../services/metricServices.js";
import ChartDataServices from "../../services/chartDataServices.js";

const props = defineProps({
  metricId: {
    type: Number,
    default: -1,
  },
  aliasId: {
    type: Number,
    default: -1,
  },
});

const dataLoaded = ref(false);
const data = ref([]);
const metricName = ref("");
const errorMsg = ref("");

const getData = async () => {
  await ChartDataServices.getPlayerChartData(
    props.aliasId,
    props.metricId,
  ).then((response) => {
    data.value = response.data;
  });
};

const getMetric = async () => {
  await MetricServices.getMetric(props.metricId)
    .then((response) => {
      metricName.value = response.data.name;
    })
    .catch((error) => {
      errorMsg.value = error.response.data.error;
    });
};

onMounted(async () => {
  await getData();
  await getMetric();
  dataLoaded.value = true;
});
</script>

<template>
  <MetricChart
    :data-loaded="dataLoaded"
    :data-points="data"
    :metric-name="metricName"
    :error-msg="errorMsg"
  />
</template>
