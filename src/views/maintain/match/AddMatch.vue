<script setup>
import TeamServices from "../../../services/teamServices.js";

import { ref, onMounted } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import TextField from "../../../components/FormComponents/TextField.vue";
import Select from "../../../components/FormComponents/SelectBox.vue";

import MatchServices from "../../../services/matchServices.js";
import dateValidator from "../../../utils/dateOnlyValidator.js";

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
  MatchServices.createMatch(match.value)
    .then((response) => {
      if (response.status == 200) {
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
const teams = ref([]);
const match = ref({
  name: "",
  teamId: null,
  matchDate: "",
  matchIsWin: false,
});

const getTeams = () => {
  TeamServices.getAllTeams()
    .then((response) => {
      teams.value = response.data.rows.map((team) => {
        return { name: team.name, value: team.id };
      });
    })
    .catch((err) => {
      errorMsg.value = err.response.data.message;
      showDialog.value = true;
    });
};

const resetAdd = () => {
  showDialog.value = false;
  match.value.name = "";
  match.value.teamId = null;
};

const cancel = () => {
  emit("cancel");
};

onMounted(() => {
  getTeams();
});
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <TextField
        v-model="match.name"
        label="Match Name"
        :validators="{ required }"
      />
      <Select
        v-model="match.teamId"
        :items="teams"
        label="Team"
        :validators="{ required }"
      />
      <TextField
        v-model="match.matchDate"
        label="Match Date"
        :validators="{ required, dateValidator }"
      />
      <v-checkbox v-model="match.matchIsWin" label="Match Win" />
    </div>
    <div class="text-center">
      <v-btn color="primary" class="ma-4" @click="validateForm">Save</v-btn>
      <v-btn class="ma-4" @click="cancel">Cancel</v-btn>
    </div>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMsg ? errorMsg : "Successfully Added Match!" }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="resetAdd">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
