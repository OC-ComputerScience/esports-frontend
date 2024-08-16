<script setup>
import TeamServices from "../../../services/teamServices.js";

import { ref } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import TextField from "../../../components/FormComponents/TextField.vue";
import Select from "../../../components/FormComponents/SelectBox.vue";

const validator = new FormValidator();

const props = defineProps({
  titles: {
    type: Array,
    default() {
      return [];
    },
  },
});

const validateForm = async () => {
  if (await validator.isFormValid()) {
    addTeam();
  } else {
    return;
  }
};

const addTeam = () => {
  TeamServices.addTeam(team.value)
    .then((response) => {
      if (response.status == 200) {
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

const errorMsg = ref("");
const showDialog = ref(false);
const team = ref({
  name: "",
  isFlagship: false,
  titleId: null,
  teamColor: "80162b",
});

const resetAdd = () => {
  showDialog.value = false;
  team.value = {
    name: "",
    isFlagship: false,
    titleID: null,
  };
};
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <v-row>
        <v-col>
          <Select
            v-model="team.titleId"
            :items="props.titles"
            label="Title"
            :validators="{ required }"
          />
          <TextField
            v-model="team.name"
            label="Team Name"
            :validators="{ required }"
          />
          <v-checkbox v-model="team.isFlagship" label="Is Flagship" />
        </v-col>
        <v-col>
          <v-color-picker v-model="team.teamColor" class="mx-auto my-2" />
        </v-col>
      </v-row>
    </div>
    <div class="text-center">
      <v-btn color="primary" class="ma-4" @click="validateForm"> Save </v-btn>
      <v-btn class="ma-4" @click="dialog = false"> Cancel </v-btn>
    </div>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMsg ? errorMsg : "Successfully Added Team!" }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="resetAdd"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
