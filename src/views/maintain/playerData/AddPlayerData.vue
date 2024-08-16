<script setup>
import { ref, onMounted } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import TextField from "../../../components/FormComponents/TextField.vue";
import Select from "../../../components/FormComponents/SelectBox.vue";

import MetricServices from "../../../services/metricServices.js";
import PlayerDataServices from "../../../services/playerDataServices.js";

const props = defineProps({
  titleId: {
    type: Number,
    default: -1,
  },
  participantId: {
    type: Number,
    default: -1,
  },
});

const validator = new FormValidator();
const emit = defineEmits(["cancel"]);

const validateForm = async () => {
  if (await validator.isFormValid()) {
    addMatch();
  } else {
    return;
  }
};

const addMatch = () => {
  PlayerDataServices.createPlayerData(data.value)
    .then((response) => {
      if (response.status == 201) {
        showDialog.value = true;
      } else {
        errorMsg.value = response.data.message;
      }
    })
    .catch((err) => {
      errorMsg.value = err.response.data.message;
      showDialog.value = true;
    });
};

const errorMsg = ref("");
const showDialog = ref(false);
const metrics = ref([]);
const data = ref({
  name: "",
  participantId: props.participantId,
  teamId: null,
});

const getMetrics = () => {
  MetricServices.getAllPlayerMetricsForTitle(props.titleId)
    .then((response) => {
      metrics.value = response.data.map((metric) => {
        return { name: metric.name, value: metric.id };
      });
    })
    .catch((err) => {
      errorMsg.value = err.response.data.message;
      showDialog.value = true;
    });
};

const resetAdd = () => {
  showDialog.value = false;
  data.value.name = "";
  data.value.teamId = null;
};

const cancel = () => {
  emit("cancel");
};

onMounted(() => {
  getMetrics();
});
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <Select
        v-model="data.metricId"
        :items="metrics"
        label="Metric"
        :validators="{ required }"
      />
      <TextField
        v-model="data.value"
        label="Value"
        :validators="{ required }"
      />
    </div>
    <div class="text-center">
      <v-btn color="primary" class="ma-4" @click="validateForm">Save</v-btn>
      <v-btn class="ma-4" @click="cancel">Cancel</v-btn>
    </div>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMsg ? errorMsg : "Successfully Added Player Data!" }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="resetAdd">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
