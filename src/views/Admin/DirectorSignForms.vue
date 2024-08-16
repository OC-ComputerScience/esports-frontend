<script setup>
import Utils from "../../config/utils.js";
import { ref, onMounted } from "vue";
import FormSignatureDialog from "../../components/FormSignatureDialog.vue";
import UnsignedFormVersion from "../../components/Admin/UnsignedFormVersion.vue";
import FormServices from "../../services/formServices.js";
import FormSignatureServices from "../../services/formSignatureServices.js";

const user = Utils.getStore("user");

const props = defineProps({
  formId: {
    type: Number,
    required: true,
  },
});

const form = ref(null);
const showSigDialog = ref(false);
const formToSign = ref(-1);

const formVersions = ref([]);
const loading = ref(true);

const panel = ref([]);
const getFormData = async () => {
  await FormServices.getFormById(props.formId).then((response) => {
    form.value = response.data;
  });
};

const getAllUnsignedForms = async () => {
  formVersions.value.forEach(async (form) => {
    getUnsignedFormsForVersion(form);
  });
};

const getUnsignedFormsForVersion = async (version) => {
  await FormSignatureServices.getDirectorUnsigned(version.id).then(
    (response) => {
      const currentIndex = formVersions.value.indexOf(version);
      if (response.data.length < 1) {
        formVersions.value.splice(currentIndex, 1);
      } else {
        formVersions.value[currentIndex].unsignedForms = response.data;
      }
    },
  );
};

const getFormVersions = async () => {
  await FormServices.getFormVersions(props.formId).then((response) => {
    formVersions.value = response.data;
    console.log(formVersions.value);
  });
};

const refreshFormVersions = (signedFormId) => {
  let formVersionToRefresh = null;
  if (formVersions.value.length > 1) {
    formVersions.value.forEach((version) => {
      version.unsignedForms.forEach((signature) => {
        if (signature.id == signedFormId) {
          formVersionToRefresh = version;
        }
      });
    });
  } else {
    formVersionToRefresh = formVersions.value[0];
  }
  getUnsignedFormsForVersion(formVersionToRefresh);
};

const handleFormSigned = async (fontSelection) => {
  showSigDialog.value = false;
  const data = {
    directorId: user.userId,
    directorFont: fontSelection,
  };
  await FormSignatureServices.directorFormSignature(formToSign.value, data);
  refreshFormVersions(formToSign.value);
  formToSign.value = -1;
};

const handleShowSignatureDialog = (formId) => {
  showSigDialog.value = true;
  formToSign.value = formId;
};

onMounted(async () => {
  await getFormData();
  await getFormVersions();
  await getAllUnsignedForms();
  panel.value[0] = formVersions.value[0].versionNumber;
  loading.value = false;
});
</script>

<template>
  <v-container>
    <h1 class="pb-4">Sign {{ form != null ? form.name : "Form" }}s</h1>

    <v-expansion-panels
      v-if="!loading && formVersions.length > 0"
      v-model="panel"
    >
      <v-expansion-panel
        v-for="version in formVersions"
        :key="version.id"
        :value="version.versionNumber"
      >
        <v-expansion-panel-title>
          <v-row class="align-center" no-gutters>
            <v-col cols="4" class="d-flex justify-start">
              {{ "Version " + version.versionNumber }}
            </v-col>
            <v-col>
              <v-chip class="bg-primary">
                {{ version.unsignedForms?.length }}
              </v-chip>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <UnsignedFormVersion
            :unsigned-forms="version.unsignedForms"
            @sign-form="handleShowSignatureDialog"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card v-else class="pa-2"> All Forms have been signed </v-card>

    <FormSignatureDialog
      :show="showSigDialog"
      :form-version-id="formToSign"
      :require-user-acknowledgement="false"
      @cancel="showSigDialog = false"
      @form-signed="handleFormSigned"
    />
  </v-container>
</template>
