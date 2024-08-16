<script setup>
import { ref, onMounted } from "vue";
import UnsignedFormVersion from "./UnsignedFormVersion.vue";
import FormServices from "../../services/formServices.js";
import FormSignatureServices from "../../services/formSignatureServices.js";

const props = defineProps({
  form: {
    type: Number,
    required: true,
  },
});

const formVersions = ref([]);
const loading = ref(true);

const getUnsignedFormsForVersion = async () => {
  formVersions.value.forEach(async (form) => {
    await FormSignatureServices.getDirectorUnsigned(form.id).then(
      (response) => {
        const currentIndex = formVersions.value.indexOf(form);
        if (response.data.length < 1) {
          formVersions.value.pop(currentIndex);
        } else {
          formVersions.value[currentIndex].unsignedForms = response.data;
        }
        if (currentIndex >= formVersions.value.length) {
          loading.value = false;
        }
      },
    );
  });
};

const getFormVersions = async () => {
  await FormServices.getFormVersions(props.form).then((response) => {
    formVersions.value = response.data;
    console.log(formVersions.value);
  });
};

onMounted(async () => {
  await getFormVersions();
  await getUnsignedFormsForVersion();
});
</script>

<template>
  <v-expansion-panels v-if="!loading">
    <v-expansion-panel v-for="version in formVersions" :key="version.id">
      <v-expansion-panel-title>
        <v-row class="align-center" no-gutters>
          <v-col cols="4" class="d-flex justify-start">
            {{ version.source }}
          </v-col>
          <v-col>
            <v-chip class="bg-primary">
              {{ version.unsignedForms.length }}
            </v-chip>
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <UnsignedFormVersion :unsigned-forms="version.unsignedForms" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
