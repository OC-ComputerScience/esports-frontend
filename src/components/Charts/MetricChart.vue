<script setup>
import { ref, watch } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

const data = ref([]);
const dataProcessed = ref(false);
const showOverlay = ref(true);
const error = ref("");

const props = defineProps({
  dataPoints: {
    type: Array,
    default: null,
  },
  metricName: {
    type: String,
    default: "",
  },
  dataLoaded: {
    type: Boolean,
    default: false,
  },
  errorMsg: {
    type: String,
    default: "",
  },
});

const chartData = {
  labels: [],
  datasets: [
    {
      label: props.metricName,
      data: [],
      borderColor: "#80162B",
      backgroundColor: "#80162B",
      tension: 0.2,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
);

const sortData = () => {
  data.value.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Compare the dates and return the comparison result
    return dateA - dateB;
  });
};

watch(props, () => {
  if (!dataProcessed.value && props.errorMsg == "") {
    data.value = props.dataPoints;
    sortData();
    data.value.forEach((dataPoint) => {
      chartData.datasets[0].data.push(dataPoint.value);
      chartData.labels.push(dataPoint.matchDate);
    });
    if (data.value.length < 1) {
      error.value = "No Data to Display";
    } else {
      dataProcessed.value = true;
      showOverlay.value = false;
    }
  } else if (props.errorMsg) {
    error.value = props.errorMsg;
  }
});
</script>

<template>
  <v-card class="elevation-0">
    <v-overlay
      v-model="showOverlay"
      contained
      class="align-center justify-center"
    >
      <h3 v-if="error">{{ error }}</h3>
      <v-progress-circular v-else color="secondary" size="50" indeterminate />
    </v-overlay>

    <v-card-title>{{ props.metricName }}</v-card-title>

    <Line
      v-if="dataProcessed"
      :options="chartOptions"
      class="ma-3"
      :data="chartData"
    />
    <Line v-else :options="chartOptions" class="ma-3" :data="chartData" />
  </v-card>
</template>
