<script setup>
import VuePdfEmbed from "vue-pdf-embed";
import { onMounted, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import FormServices from "../services/formServices.js";
import FormSignatureServices from "../services/formSignatureServices.js";
import FormSignatureDialog from "../components/FormSignatureDialog.vue";
import DownloadFormDialog from "../components/DownloadFormDialog.vue";

import Utils from "../config/utils.js";

const user = Utils.getStore("user");

const router = useRouter();

const currentPDF = ref("");
const pdfWidth = ref(0);
const parentCol = ref(null);
const currentFormNumber = ref(null);
const currentFormVersion = ref(null);
const formList = ref([]);
const formSigned = ref(false);

const showDialog = ref(false);

const getForms = async () => {
  const formResponse = await FormServices.getAllForms();
  const forms = formResponse.data;

  const signatureResponse = await FormSignatureServices.getMostRecentForUser(
    user.userId,
  );
  const userSignatures = signatureResponse.data;

  forms.forEach((form) => {
    const currentVersionId = form.formVersions[0].id;
    let isFormSigned = false;

    userSignatures.forEach((signature) => {
      if (signature.formVersionId == currentVersionId) {
        isFormSigned = true;
      }
    });

    if (!isFormSigned) {
      formList.value.push(form);
    }
  });

  if (formList.value.length > 0) {
    currentPDF.value =
      "http://localhost:3100/Forms/" +
      formList.value[0].name +
      "/" +
      formList.value[0].formVersions[0].source;
    currentFormNumber.value = 0;
    currentFormVersion.value = formList.value[0].formVersions[0].id;
  } else {
    router.push({ name: "Dashboard" });
  }
};

const handleFormSigned = (fontSelection) => {
  const data = {
    dateSigned: Date.now(),
    userId: user.userId,
    formVersionId: currentFormVersion.value,
    fontSelection: fontSelection,
  };
  FormSignatureServices.createFormSignature(data);

  showDialog.value = false;
  formSigned.value = true;
};

const nextForm = () => {
  if (currentFormNumber.value < formList.value.length - 1) {
    currentFormNumber.value += 1;
    currentFormVersion.value =
      formList.value[currentFormNumber.value].formVersions[0].id;
    currentPDF.value =
      "http://localhost:3100/Forms/" +
      formList.value[currentFormNumber.value].name +
      "/" +
      formList.value[currentFormNumber.value].formVersions[0].source;
    console.log(currentPDF.value);

    formSigned.value = false;
  } else {
    router.push({ name: "Dashboard" });
  }
};

onMounted(async () => {
  await getForms();
  await nextTick();
  pdfWidth.value = parentCol.value.$el.clientWidth - 40;
});
</script>

<script>
export default {
  computed: {
    cols() {
      let returnValue = 0;
      switch (this.$vuetify.display.name) {
        case "xs":
          returnValue = 12;
          break;
        case "sm":
          returnValue = 11;
          break;
        case "md":
          returnValue = 10;
          break;
        case "lg":
          returnValue = 9;
          break;
        case "xl":
          returnValue = 9;
          break;
        case "xxl":
          returnValue = 9;
      }
      return returnValue;
    },
  },
};
</script>

<template>
  <div>
    <v-container class="pt-1">
      <v-col
        ref="parentCol"
        :cols="cols"
        class="mx-auto pt-0 justify-content-center"
      >
        <v-toolbar
          v-if="currentFormNumber != null"
          class="mx-0"
          color="#211315"
        >
          <v-row no-gutters class="w-100 px-5 align-center">
            <v-col cols="4">
              <v-toolbar-title
                >Sign {{ formList[currentFormNumber].name }}</v-toolbar-title
              >
            </v-col>

            <v-col cols="4" class="text-center">
              <v-toolbar-title
                >Form
                {{
                  `${currentFormNumber + 1} of ${formList.length}`
                }}</v-toolbar-title
              >
            </v-col>

            <v-col cols="4" class="d-flex justify-end">
              <v-btn
                variant="flat"
                color="primary"
                class="mx-2"
                size="large"
                :disabled="formSigned"
                @click="showDialog = !showDialog"
              >
                Sign
                <v-icon class="ml-2"> mdi-file-sign </v-icon>
              </v-btn>

              <v-btn
                variant="flat"
                color="primary"
                class="ml-2"
                size="large"
                :disabled="!formSigned"
                @click="nextForm"
              >
                {{
                  currentFormNumber < formList.length - 1
                    ? "Next Form"
                    : "Finish"
                }}
                <v-icon class="ml-2"> mdi-chevron-right </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-row justify="center">
          <v-card :key="formSigned" class="scrollpane mt-3 rounded-0">
            <vue-pdf-embed
              :source="currentPDF"
              :width="pdfWidth"
            ></vue-pdf-embed>
            <DownloadFormDialog
              v-if="formSigned"
              :show="formSigned"
              :form-version="currentFormVersion"
              :pdf-name="formList[currentFormNumber].formVersions[0].source"
              :require-director-signature="
                formList[currentFormNumber].formVersions[0].requireDirectorSig
              "
            />
          </v-card>
        </v-row>
      </v-col>
    </v-container>
    <FormSignatureDialog
      v-if="currentFormVersion != null"
      :show="showDialog"
      :form-version-id="currentFormVersion"
      @cancel="showDialog = false"
      @form-signed="handleFormSigned"
    />
  </div>
</template>

<style scoped>
.scrollpane {
  max-height: 77vh; /* Set a maximum height for the scrollpane */
  width: fit-content;
  overflow-y: auto; /* Enable vertical scrolling if content overflows */
  border: 1px solid #ccc; /* Optional: Add a border for visual clarity */
}
</style>
