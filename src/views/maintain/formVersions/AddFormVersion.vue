<script setup>
import { ref } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator.js";

import FormServices from "../../../services/formServices.js";
import DateTextField from "../../../components/FormComponents/DateTextField.vue";
import TextField from "../../../components/FormComponents/TextField.vue";

const validator = new FormValidator();

const props = defineProps({
  formId: {
    type: Number,
    required: true,
  },
});

const validateForm = async () => {
  if (await validator.isFormValid()) {
    addFormVersion();
  } else {
    return;
  }
};

const addFormVersion = () => {
  console.log(currentFile.value);
  formVersion.value.source = currentFile.value[0].name;

  FormServices.addFormVersion(props.formId, formVersion.value)
    .then((response) => {
      if (response.status == 201) {
        showDialog.value = true;
        uploadFormFile(response.data.id);
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
const formVersion = ref({
  source: "",
  effectiveDate: "",
  expireDate: "",
  versionNumber: "",
});
const currentFile = ref(undefined);

const uploadFormFile = async (formVersionId) => {
  errorMsg.value = "";
  if (!currentFile.value) {
    console.log("Please select a file!");
    errorMsg.value = "Please select a file!";
    return;
  }

  try {
    console.log("upload Form");
    const response = await FormServices.uploadFormFile(
      formVersionId,
      currentFile.value,
    );

    errorMsg.value = response.data.message;
  } catch (error) {
    console.log(error);
    if (error.request.status == 404) {
      errorMsg.value = "Form Version not found!";
    } else {
      errorMsg.value = "An error occured when uploading the file!";
    }
    currentFile.value = undefined;
  }
};

const resetAdd = () => {
  showDialog.value = false;
  formVersion.value = {
    source: "",
    effectiveDate: "",
    expireDate: "",
    versionNumber: "",
  };
};
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <v-col>
        <v-file-input
          v-model="currentFile"
          label="Upload Form"
          prepend-inner-icon="mdi-paperclip"
          prepend-icon="null"
          class="ml-n10 px-5"
          :error-messages="errorMessage"
          :messages="message"
          @change="fileChanged = true"
        ></v-file-input>

        <DateTextField
          v-model="formVersion.effectiveDate"
          label="Effective Date"
          :rules="[
            () => !!formVersion.effectiveDate || 'This value is required!',
          ]"
        />
        <DateTextField
          v-model="formVersion.expireDate"
          label="Expiration Date"
          :rules="[() => !!formVersion.expireDate || 'This value is required!']"
        />
        <TextField
          v-model="formVersion.versionNumber"
          label="Version Number"
          :validators="{ required }"
        />
      </v-col>
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
