<script setup>
import MatchDataServices from "../../../services/matchDataServices.js";

import { ref } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import TextField from "../../../components/FormComponents/TextField.vue";
import SelectBox from "../../../components/FormComponents/SelectBox.vue";

const props = defineProps({
  matchId: {
    type: Number,
    default: -1,
  },
  metrics: {
    type: Array,
    default: null,
  },
});

const validator = new FormValidator();
const emit = defineEmits(["cancel"]);

const resetAdd = () => {
  showDialog.value = false;
  matchData.value.metricId = null;
  matchData.value.value = "";
};

const validateForm = async () => {
  if (await validator.isFormValid()) {
    addMatchData();
  } else {
    return;
  }
};

const addMatchData = () => {
  console.log(matchData.value);
  MatchDataServices.addMatchData(matchData.value)
    .then((response) => {
      if (response.status == 201) {
        showDialog.value = true;
      } else {
        errorMsg.value = response.data.message;
      }
    })
    .catch((error) => {
      errorMsg.value = error.response.data.message;
      showDialog.value = true;
    });
};

const cancel = () => {
  resetAdd();
  emit("cancel");
};

const errorMsg = ref("");
const showDialog = ref(false);
const matchData = ref({
  value: "",
  metricId: null,
  matchId: props.matchId,
});
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <TextField
        v-model="matchData.value"
        label="Value"
        :validators="{ required }"
      />
      <SelectBox
        v-model="matchData.metricId"
        :items="props.metrics"
        label="Metric"
        :validators="{ required }"
      />
    </div>
    <div class="text-center">
      <v-btn color="primary" class="ma-4" @click="validateForm"> Save </v-btn>
      <v-btn class="ma-4" @click="cancel"> Cancel </v-btn>
    </div>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMsg ? errorMsg : "Successfully Added MatchData!" }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="resetAdd"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
