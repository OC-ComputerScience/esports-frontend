<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import TextField from "../../../components/FormComponents/TextField.vue";
import EmailListItem from "../../../components/View/EmailListItem.vue";

import FormValidator from "../../../components/FormComponents/support/FormValidator";

import UserServices from "../../../services/userServices";
import { required, email } from "@vuelidate/validators"; // Check before deleting this

const router = useRouter();

const addMethod = ref(0);

const validator = new FormValidator();

const validateForm = async () => {
  if (await validator.isFormValid()) {
    await addEmails();
  } else {
    return;
  }
};

const useCustomDelimiter = ref(false);
const selectedDelimiter = ref("");
const separatorOptions = [", ", ",", " ", "\t", "\n", ":", "|"];

const userInputList = ref("");
const emails = ref([]);
const showDialog = ref(false);
const loading = ref(false);

const addEmails = async () => {
  loading.value = true;
  if (addMethod.value == 0) {
    let duplicate = await emailExists(emails.value[0]);
    if (!duplicate) {
      createUserFromEmail(emails.value[0]);
    }
  } else {
    for (let i = 0; i < emails.value.length; i++) {
      let duplicate = await emailExists(emails.value[i]);
      if (!duplicate) {
        createUserFromEmail(emails.value[i]);
        i--;
      }
    }
  }
  loading.value = false;
  showDialog.value = true;
};

const createUserFromEmail = (email) => {
  UserServices.createUser({ email: email });
  removeEmail(email);
};

const emailExists = async (email) => {
  let response = await UserServices.getUserByEmail(email);
  return response.data.count != 0;
};

const findDelimiter = () => {
  separatorOptions.every((delimiter) => {
    if (userInputList.value.includes(delimiter)) {
      console.log(delimiter);
      selectedDelimiter.value = delimiter;
      return false;
    }
    return true;
  });
};

const parseEmails = () => {
  if (!useCustomDelimiter.value) findDelimiter();

  emails.value = userInputList.value.split(selectedDelimiter.value);
  userInputList.value = "";
};

const removeEmail = (email) => {
  emails.value = emails.value.filter((value) => value != email);
};

const returnToDashboard = () => {
  router.push({ name: "Dashboard" });
};
</script>

<script>
export default {
  computed: {
    cols() {
      const { xs, sm } = this.$vuetify.display;
      return xs ? 12 : sm ? 10 : 6;
    },
  },
};
</script>

<template>
  <v-col class="mx-auto" :cols="cols">
    <v-radio-group v-model="addMethod" class="pa-2" color="text primary">
      <v-radio label="Add One" :value="0" />
      <v-radio label="Add List" :value="1" />
    </v-radio-group>

    <TextField
      v-if="addMethod == 0"
      v-model="emails[0]"
      class="w-75 mx-auto pt-6"
      label="Email"
      :validators="{ required, email }"
    />
    <div v-if="addMethod == 1" class="w-75 mx-auto pt-6">
      <div v-if="emails.length < 1">
        <v-textarea v-model="userInputList" name="values" label="Values" />
        <v-row class="mx-3">
          <v-checkbox
            v-model="useCustomDelimiter"
            label="Custom Delimiter"
            value="value"
          />
          <v-text-field
            v-if="useCustomDelimiter"
            id="id"
            v-model="selectedDelimiter"
            name="name"
            label="Delimiter"
          />
        </v-row>
        <v-row>
          <v-btn
            color="accent"
            class="mx-auto mt-2 mb-6"
            :disabled="userInputList.length < 1"
            @click="parseEmails()"
          >
            Split Values
          </v-btn>
        </v-row>
      </div>
      <EmailListItem
        v-for="currentEmail in emails"
        :key="emails.indexOf(currentEmail)"
        v-model="emails[emails.indexOf(currentEmail)]"
        @email-removed="removeEmail(currentEmail)"
      />
    </div>

    <v-row
      v-if="addMethod == 0 || emails.length > 0"
      class="justify-center mb-4 mt-3"
    >
      <v-btn color="success" class="w-25 mx-4" @click="validateForm">
        Add
      </v-btn>
      <v-btn color="secondary" class="w-25 mx-4" @click="returnToDashboard()">
        Cancel
      </v-btn>
    </v-row>

    <v-overlay v-model="loading" contained class="align-center justify-center">
      <v-progress-circular indeterminate />
    </v-overlay>

    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-list v-if="emails.length > 0">
          <v-list-item
            v-for="currentEmail in emails"
            :key="emails.indexOf(currentEmail)"
            :title="`'${currentEmail}' already exists!`"
          />
        </v-list>
        <v-card-text v-else> Successfully Added Emails! </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="showDialog = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>
