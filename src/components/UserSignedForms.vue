<script setup>
import { ref, onMounted, computed } from "vue";
import Utils from "../config/utils";

import FormServices from "../services/formServices.js";
import FormSignatureServices from "../services/formSignatureServices";

const user = Utils.getStore("user");

const signatures = ref([]);

const signatureItems = computed(() => {
  return signatures.value.filter((item) => {
    const formType = item.formName == currentTab.value;
    const directorSigned =
      !item.requireDirectorSignature || item.directorDateSigned != null;

    return formType && directorSigned;
  });
});

const currentTab = ref("");
const showDialog = ref(false);

const tableHeaders = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Date Signed",
    key: "dateSigned",
  },
  {
    title: "Effective Date",
    key: "effectiveDate",
  },
  {
    title: "Expire Date",
    key: "expireDate",
  },
];

const mapToTableFormat = (data) => {
  return data.map((item) => ({
    name: item.formVersion?.source || "N/A",
    dateSigned: item.dateSigned || "N/A",
    effectiveDate: item.formVersion?.effectiveDate || "N/A",
    expireDate: item.formVersion?.expireDate || "N/A",
    formName: item.formVersion?.form?.name || "N/A",
    formVersionId: item.formVersion?.id,
    requireDirectorSignature: item.formVersion?.requireDirectorSig || false,
    directorDateSigned: item.directorDateSigned,
  }));
};

const getSignedForm = async (item) => {
  try {
    const pdfResponse = await FormServices.getSignedForm(
      user.userId,
      item.formVersionId,
    );

    const linkSource = `data:application/pdf;base64,${pdfResponse.data}`;
    const pdfWindow = window.open(); // Open a new tab or window
    if (pdfWindow) {
      pdfWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>${item.formName} Preview</title>
                <style>
                    html, body {
                        margin: 0; /* Remove margins */
                        padding: 0; /* Remove padding */
                        height: 100%; /* Ensure full height for iframe */
                        overflow: hidden; /* Prevent scrollbars */
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <iframe src="${linkSource}"></iframe>
            </body>
            </html>
        `);
      pdfWindow.document.close(); // Complete document stream
    } else {
      const downloadLink = document.createElement("a");

      downloadLink.href = linkSource;
      downloadLink.download = item.name;
      downloadLink.click();
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

onMounted(() => {
  FormSignatureServices.getAllForUser().then((response) => {
    signatures.value = mapToTableFormat(response.data);
  });
});
</script>

<template>
  <div>
    <v-card>
      <v-tabs v-model="currentTab" color="primary" dark slider-color="primary">
        <v-tab value="Player Agreement"> Player Agreements </v-tab>
        <v-tab value="Travel Waiver"> Travel Waivers </v-tab>
      </v-tabs>
      <v-data-table :items="signatureItems" :headers="tableHeaders">
        <template #[`item.name`]="{ item }">
          <a href="#" @click="getSignedForm(item)">{{ item.name }}</a>
        </template>
      </v-data-table>
    </v-card>

    <v-overlay v-model="showDialog" class="align-center justify-center">
      <v-card>
        <div class="d-flex flex-column justify-center">
          <v-card-text class="text-subtitle-1">
            There was an issue loading the pdf preview. Please download the form
            directly
          </v-card-text>
          <v-btn class="ma-4 mx-auto" color="primary" @click="getSignedForm">
            Download Signed Form
            <v-icon class="ml-2"> mdi-download </v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-overlay>
  </div>
</template>
