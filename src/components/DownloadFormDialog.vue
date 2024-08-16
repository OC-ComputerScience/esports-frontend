<script setup>
import { onMounted, computed } from "vue";

import Utils from "../config/utils";

import FormServices from "../services/formServices.js";

const props = defineProps({
  show: Boolean,
  formVersion: {
    type: Number,
    required: true,
  },
  pdfName: {
    type: String,
    required: true,
  },
  requireDirectorSignature: {
    type: Boolean,
    default: false,
  },
});

const showDialog = computed(() => props.show);
const user = Utils.getStore("user");

const getSignedForm = async () => {
  try {
    const pdfResponse = await FormServices.getSignedForm(
      user.userId,
      props.formVersion,
    );

    const linkSource = `data:application/pdf;base64,${pdfResponse.data}`;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = props.pdfName;
    downloadLink.click();
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

onMounted(() => {});
</script>

<template>
  <v-overlay
    v-model="showDialog"
    contained
    persistent
    class="align-center justify-center"
  >
    <v-card v-if="!props.requireDirectorSignature">
      <div class="d-flex justify-center">
        <v-btn class="ma-4 mx-auto" color="primary" @click="getSignedForm">
          Download Signed Form
          <v-icon class="ml-2"> mdi-download </v-icon>
        </v-btn>
      </div>
      <v-card-text class="text-center">
        You can download signed forms on the "My Info" page at any time
      </v-card-text>
    </v-card>
    <v-card v-else class="pa-2">
      <v-card-text class="text-h5 text-center"> Form Signed </v-card-text>
      <v-card-text>
        You will recieve a copy in your email when the director has signed it
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<style type="text/css">
@import url("https://fonts.googleapis.com/css?family=Allura");
@import url("https://fonts.googleapis.com/css?family=Pacifico");
@import url("https://fonts.googleapis.com/css?family=Style Script");
@import url("https://fonts.googleapis.com/css?family=Alex Brush");
@import url("https://fonts.googleapis.com/css?family=Meie Script");

.container {
  width: 400px;
  height: 400px;
}
</style>
