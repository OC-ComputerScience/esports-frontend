<script setup>
import MetricServices from "../../../services/metricServices.js";

import { ref } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import TextField from "../../../components/FormComponents/TextField.vue";
import ComboBox from "../../../components/FormComponents/ComboBox.vue";

const props = defineProps({
  titleId: {
    type: Number,
    default: -1,
  },
  dataTypes: {
    type: Array,
    default: null,
  },
  metricTypes: {
    type: Array,
    default: null,
  },
});

const validator = new FormValidator();

const validateForm = async () => {
  if (await validator.isFormValid()) {
    addMetric();
  } else {
    return;
  }
};

const addMetric = () => {
  MetricServices.addMetric(metric.value)
    .then((response) => {
      console.log(response);
      if (response.status == 201) {
        showDialog.value = true;
      } else {
        console.log(response);
        errorMsg.value = response.data.message;
      }
    })
    .catch((error) => {
      errorMsg.value = error.response.data.message;
      showDialog.value = true;
    });
};

const errorMsg = ref("");
const showDialog = ref(false);
const metric = ref({
  titleId: props.titleId,
  name: "",
  metricType: "",
  dataType: "",
});

const resetAdd = () => {
  showDialog.value = false;
  metric.value = {
    titleId: props.titleId,
    name: "",
    metricType: "",
    dataType: "",
  };
};
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <TextField
        v-model="metric.name"
        label="Metric Name"
        :validators="{ required }"
      />
      <ComboBox
        v-model="metric.metricType"
        :items="props.metricTypes"
        label="Metric Type"
        :validators="{ required }"
      />
      <ComboBox
        v-model="metric.dataType"
        :items="props.dataTypes"
        label="Data Type"
        :validators="{ required }"
      />
    </div>
    <div class="text-center">
      <v-btn color="primary" class="ma-4" @click="validateForm"> Save </v-btn>
      <v-btn class="ma-4" @click="dialog = false"> Cancel </v-btn>
    </div>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMsg ? errorMsg : "Successfully Added Metric!" }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="resetAdd"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
