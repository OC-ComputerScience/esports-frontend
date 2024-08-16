<script setup>
import TitleServices from "../../../services/titleServices.js";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import DataTable from "../../../components/DataTable.vue";
import ConfirmAction from "../../../components/ConfirmAction.vue";
import TextField from "../../../components/FormComponents/TextField.vue";

import { useDataTableStore } from "../../../stores/dataTableStore.js";
import { storeToRefs } from "pinia";

const store = useDataTableStore();
const { itemsPerPage, page } = storeToRefs(store);

const router = useRouter();

const validator = new FormValidator();

const validateForm = async () => {
  if (await validator.isFormValid()) {
    updateTitle();
    dialog.value = false;
  } else {
    return;
  }
};

const titles = ref([]);
const count = ref(5);
const dialog = ref(false);
const showConfirm = ref(false);
const selectedTeam = ref({});
const teamToDelete = ref(null);
const errorMsg = ref("");
const showError = ref(false);

const actions = [
  { label: "Edit", event: "edit-title" },
  { label: "Metrics", event: "maintain-metrics" },
  { label: "Delete", event: "delete-title" },
];

const handleActionEvent = (payload) => {
  if (payload.event == "edit-title") viewTitle(payload.value);

  if (payload.event == "maintain-metrics") {
    router.push({
      name: "maintainTitleMetrics",
      params: { titleId: payload.value },
    });
  }

  if (payload.event == "delete-title") {
    teamToDelete.value = payload.value;
    showConfirmDialog();
  }
};

const showConfirmDialog = () => {
  showConfirm.value = !showConfirm.value;
};

const getTitles = () => {
  TitleServices.getTitles(itemsPerPage.value, page.value)
    .then((response) => {
      titles.value = response.data.rows;
      count.value = response.data.count;
    })
    .catch((err) => {
      // Create UI to add visual error checking
      console.log(err);
    });
};

async function getTitleForId(teamId) {
  await TitleServices.getTitle(teamId)
    .then((response) => {
      selectedTeam.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

const search = (filter) => {
  if (filter == "" || filter == null) {
    getTitles();
  } else {
    TitleServices.search(filter, itemsPerPage.value, page.value)
      .then((response) => {
        titles.value = response.data.rows;
        count.value = response.data.count;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const viewTitle = async (userId) => {
  await getTitleForId(userId);
  dialog.value = true;
};

const deleteTitle = () => {
  TitleServices.deleteTitle(teamToDelete.value)
    .then(() => {
      getTitles(5, 1);
    })
    .catch((error) => {
      errorMsg.value = error.response.data.message;
      showError.value = true;
    });
  showConfirmDialog();
};

const updateTitle = () => {
  const updatedTeam = {
    name: selectedTeam.value.name,
    isFlagship: selectedTeam.value.isFlagship,
  };
  TitleServices.updateTitle(selectedTeam.value.id, updatedTeam)
    .then(() => {
      getTitles(5, 1);
    })
    .catch((error) => {
      console.error("Error updating team:", error);
      // Handle the error, like showing an error message
    });
};

const reloadTable = () => {
  getTitles();
};

onMounted(() => {
  getTitles();
});
</script>

<template>
  <div>
    <DataTable
      :data="titles"
      :count="count"
      :columns="[{ key: 'name', label: 'Name' }]"
      :actions="actions"
      @action-event="handleActionEvent"
      @search="search"
      @reload="reloadTable"
    />
    <ConfirmAction
      :show="showConfirm"
      action="Delete"
      @action="deleteTitle"
      @cancel="showConfirmDialog"
    />
    <div class="text-center">
      <v-dialog v-model="dialog" class="w-50">
        <v-card v-if="dialog">
          <v-toolbar color="primary" title="Edit Title">
            <v-btn icon="mdi-arrow-left" @click="dialog = false" />
          </v-toolbar>
          <v-card-text>
            <TextField
              v-model="selectedTeam.name"
              label="Title Name"
              :validators="{ required }"
            />
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
