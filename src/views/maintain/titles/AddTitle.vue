<script setup>
import TitleServices from "../../../services/titleServices";

import { ref } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import TextField from "../../../components/FormComponents/TextField.vue";

const validator = new FormValidator();

const validateForm = async () => {
  if (await validator.isFormValid()) {
    addTitle();
  } else {
    return;
  }
};

const addTitle = () => {
  TitleServices.addTitle(title.value)
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
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
const title = ref({
  name: "",
});

const resetAdd = () => {
  showDialog.value = false;
  title.value = {
    name: "",
  };
};
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <TextField
        v-model="title.name"
        label="Title Name"
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
          {{ errorMsg ? errorMsg : "Successfully Added Title!" }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="resetAdd"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
