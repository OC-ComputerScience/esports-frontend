<script setup>
import { ref, onMounted, computed } from "vue";
import ComboBox from "../components/FormComponents/ComboBox.vue";
import { required } from "@vuelidate/validators";

import Utils from "../config/utils";

const user = Utils.getStore("user");

const props = defineProps({
  show: Boolean,
  formVersionId: {
    type: Number,
    required: true,
  },
  requireUserAcknowledgement: {
    type: Boolean,
    default: true,
  },
  defaultFont: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(["form-signed", "cancel"]);

const showDialog = computed(() => props.show);
const fonts = [
  "Allura",
  "Rouge Script",
  "Rochester",
  "Alex Brush",
  "Meie Script",
];
const fontSelection = ref(fonts[0]);

const signatureAcknowledge = ref(false);

const cancel = () => {
  emit("cancel");
};

const signForm = () => {
  if (props.requireUserAcknowledgement) {
    signatureAcknowledge.value = false;
  }
  emit("form-signed", fontSelection.value);
};

onMounted(() => {
  if (props.requireUserAcknowledgement == false) {
    signatureAcknowledge.value = true;
  }
  if (props.defaultFont != null) {
    fontSelection.value = props.defaultFont;
  }
});
</script>

<template>
  <div>
    <v-dialog v-model="showDialog" persistent>
      <v-card class="w-50 mx-auto">
        <v-card-title> Sign Form </v-card-title>
        <ComboBox
          v-model="fontSelection"
          :items="fonts"
          label="Signature Font"
          :validators="{ required }"
          class="w-50"
        />

        <v-card-text class="text-center"> Signature Preview </v-card-text>

        <v-card-text
          :style="{ fontFamily: fontSelection, fontSize: '42px' }"
          class="text-center"
        >
          {{ user.fName + " " + user.lName }}
        </v-card-text>

        <div class="w-100">
          <v-checkbox
            v-model="signatureAcknowledge"
            class="ml-4"
            :disabled="signatureAcknowledge"
          >
            <template #label>
              <div class="text-subtitle-2 w-75 pl-6">
                I acknowledge that, by clicking “Sign Form” below, I am
                providing my electronic signature and agreeing to the terms
                outlined in the document. I understand that my electronic
                signature carries the same legal weight as a traditional
                signature and signifies my intent to be bound by the terms and
                conditions outlined in this PDF document
              </div>
            </template>
          </v-checkbox>
        </div>

        <v-container class="w-100 mx-auto">
          <v-btn
            color="accent"
            class="w-auto mx-2 float-right"
            :disabled="!signatureAcknowledge"
            @click="signForm"
          >
            Sign Form
          </v-btn>
          <v-btn
            color="primary"
            class="auto mx-2 float-right"
            variant="outlined"
            @click="cancel"
          >
            Cancel
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<style type="text/css">
@import url("https://fonts.googleapis.com/css?family=Allura");
@import url("https://fonts.googleapis.com/css?family=Rouge Script");
@import url("https://fonts.googleapis.com/css?family=Rochester");
@import url("https://fonts.googleapis.com/css?family=Alex Brush");
@import url("https://fonts.googleapis.com/css?family=Meie Script");
</style>
