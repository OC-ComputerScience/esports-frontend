<script setup>
import { ref } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator.js";

import TextField from "../../../components/FormComponents/TextField.vue";

const validator = new FormValidator();

const validateForm = async () => {
  if (await validator.isFormValid()) {
    //addTeam();
  } else {
    return;
  }
};

// const addTeam = () => {
//   TeamServices.addTeam(team.value)
//     .then((response) => {
//       if (response.status == 200) {
//         showDialog.value = true;
//       } else {
//         errorMsg.value = response.data.message;
//       }
//     })
//     .catch((error) => {
//       errorMsg.value = error.response.data.message;
//       showDialog.value = true;
//     });
// };

const errorMsg = ref("");
const showDialog = ref(false);
const form = ref({
  name: "",
});

const resetAdd = () => {
  showDialog.value = false;
  // team.value = {
  //   name: "",
  // };
};
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <v-row>
        <v-col>
          <TextField
            v-model="form.name"
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
