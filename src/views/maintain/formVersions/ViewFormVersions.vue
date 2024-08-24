<script setup>
import FormServices from "../../../services/formServices.js";
import { ref, onMounted } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator.js";
import { useDataTableStore } from "../../../stores/dataTableStore.js";
import { storeToRefs } from "pinia";

import DataTable from "../../../components/DataTable.vue";
import ConfirmAction from "../../../components/ConfirmAction.vue";
import TextField from "../../../components/FormComponents/TextField.vue";
import DateTextField from "../../../components/FormComponents/DateTextField.vue";

import moment from "moment";

const store = useDataTableStore();
const { itemsPerPage, page } = storeToRefs(store);

const validator = new FormValidator();

const props = defineProps({
  formId: {
    type: Number,
    required: true,
  },
});

const validateForm = async () => {
  if (await validator.isFormValid()) {
    updateVersion();
    dialog.value = false;
  } else {
    return;
  }
};

const formVersions = ref([]);

const count = ref(5);
const dialog = ref(false);
const showConfirm = ref(false);

const selectedVersion = ref({});

const errorMsg = ref("");
const showError = ref(false);

const actions = [{ label: "Edit", event: "edit-version" }];

const handleActionEvent = (payload) => {
  if (payload.event == "edit-version") viewVersion(payload.value);
};

const showConfirmDialog = () => {
  showConfirm.value = !showConfirm.value;
};

const getFormVersions = () => {
  FormServices.getFormVersions(props.formId)
    .then((response) => {
      formVersions.value = response.data;
      count.value = response.data.length;
    })
    .catch((err) => {
      // Create UI to add visual error checking
      errorMsg.value = err.message;
      showError.value = true;
    });
};

async function getVersionForId(versionId) {
  await FormServices.getFormVersionById(versionId)
    .then((response) => {
      selectedVersion.value = response.data;
      selectedVersion.value.effectiveDate = moment(
        selectedVersion.value.effectiveDate,
      );
      selectedVersion.value.expireDate = moment(
        selectedVersion.value.expireDate,
      );
    })
    .catch((err) => {
      errorMsg.value = err.message;
      showError.value = true;
    });
}

const search = (filter) => {
  if (filter == "" || filter == null) {
    getFormVersions(itemsPerPage.value, page.value);
  } else {
    FormServices.search(filter, itemsPerPage.value, page.value)
      .then((response) => {
        formVersions.value = response.data.rows;
        count.value = response.data.count;
      })
      .catch((err) => {
        errorMsg.value = err.message;
        showError.value = true;
      });
  }
};

const viewVersion = async (versionId) => {
  await getVersionForId(versionId);
  dialog.value = true;
};

const updateVersion = () => {
  const updatedVersion = {
    effectiveDate: selectedVersion.value.effectiveDate.toISOString(),
    expireDate: selectedVersion.value.expireDate.toISOString(),
    versionNumber: selectedVersion.value.versionNumber,
  };
  FormServices.updateFormVersion(selectedVersion.value.id, updatedVersion)
    .then(() => {
      getFormVersions(itemsPerPage.value, page.value);
    })
    .catch((error) => {
      // Handle the error, like showing an error message
      errorMsg.value = error.message;
      showError.value = true;
    });
};

const reloadTable = () => {
  getFormVersions(itemsPerPage.value, page.value);
};

onMounted(() => {
  reloadTable();
});
</script>

<template>
  <div>
    <DataTable
      :data="formVersions"
      :count="count"
      :columns="[
        { key: 'source', label: 'Source' },
        { key: 'effectiveDate', label: 'Effective Date' },
        { key: 'expireDate', label: 'Expiration Date' },
        { key: 'versionNumber', label: 'Version Number' },
      ]"
      :actions="actions"
      @action-event="handleActionEvent"
      @search="search"
      @reload="reloadTable"
    ></DataTable>
    <ConfirmAction
      :show="showConfirm"
      action="Delete"
      @action="deleteTeam"
      @cancel="showConfirmDialog"
    />
    <div class="text-center">
      <v-dialog v-model="dialog" class="w-50">
        <v-card v-if="dialog">
          <v-toolbar color="primary" title="Edit Version">
            <v-btn icon="mdi-arrow-left" @click="dialog = false" />
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col>
                <DateTextField
                  v-model="selectedVersion.effectiveDate"
                  label="Effective Date"
                  :rules="[
                    () =>
                      !!selectedVersion.effectiveDate ||
                      'This value is required!',
                  ]"
                />
                <DateTextField
                  v-model="selectedVersion.expireDate"
                  label="Expiration Date"
                  :rules="[
                    () =>
                      !!selectedVersion.expireDate || 'This value is required!',
                  ]"
                />
                <TextField
                  v-model="selectedVersion.versionNumber"
                  label="Version Number"
                  :validators="{ required }"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <div class="text-center">
            <v-btn color="primary" class="ma-4" @click="validateForm">
              Save
            </v-btn>
            <v-btn class="ma-4" @click="dialog = false"> Cancel </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </div>
    <v-dialog v-model="showError" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMsg }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="showError = false"> OK </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
