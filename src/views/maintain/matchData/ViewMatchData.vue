<script setup>
import MatchDataServices from "../../../services/matchDataServices.js";

import { ref } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";
import { useDataTableStore } from "../../../stores/dataTableStore.js";

import DataTable from "../../../components/DataTable.vue";
import ConfirmAction from "../../../components/ConfirmAction.vue";
import TextField from "../../../components/FormComponents/TextField.vue";
import Select from "../../../components/FormComponents/SelectBox.vue";
import { storeToRefs } from "pinia";

const store = useDataTableStore();
const { itemsPerPage, page } = storeToRefs(store);

const validator = new FormValidator();

const validateForm = async () => {
  if (await validator.isFormValid()) {
    updateMatchData();
  } else {
    return;
  }
};

const props = defineProps({
  matchId: {
    type: Number,
    default: -1,
  },
  metrics: {
    type: Array,
    default: null,
  },
});

const count = ref(5);
const editDialog = ref(false);
const showConfirm = ref(false);
const selectedMatchData = ref({});
const matchDataToDelete = ref(null);
const errorMsg = ref("");
const showError = ref(false);

const matchData = ref([]);

const actions = [
  { label: "Edit", event: "edit-matchData" },
  { label: "Delete", event: "delete-matchData" },
];

const handleActionEvent = (payload) => {
  if (payload.event == "edit-matchData") viewMatch(payload.value);

  if (payload.event == "delete-matchData") {
    matchDataToDelete.value = payload.value;
    showConfirmDialog();
  }
};

const showConfirmDialog = () => {
  showConfirm.value = !showConfirm.value;
};

const toggleEditDialog = () => {
  editDialog.value = !editDialog.value;
};

const getMatchData = () => {
  MatchDataServices.getMatchDataForMatch(
    props.matchId,
    itemsPerPage.value,
    page.value,
  )
    .then((response) => {
      matchData.value = response.data.rows.map((matchData) => {
        return {
          id: matchData.id,
          data: matchData.value,
          metric: matchData.metric.name,
        };
      });
      count.value = response.data.count;
    })
    .catch((err) => {
      errorMsg.value = err.message || "Something went wrong";
      showError.value = true;
    });
};

const search = (filter) => {
  if (filter == "" || filter == null) {
    getMatchData(itemsPerPage.value, page.value);
  } else {
    MatchDataServices.search(
      props.matchId,
      filter,
      itemsPerPage.value,
      page.value,
    )
      .then((response) => {
        matchData.value = response.data.rows.map((matchData) => {
          return {
            id: matchData.id,
            data: matchData.value,
            metric: matchData.metric.name,
          };
        });
        count.value = response.data.count;
      })
      .catch((err) => {
        errorMsg.value = err.message;
        showError.value = true;
      });
  }
};

const viewMatch = async (id) => {
  await MatchDataServices.getMatchData(id)
    .then((response) => {
      selectedMatchData.value = response.data;
    })
    .catch((err) => {
      errorMsg.value = err.message;
      showError.value = true;
    });
  editDialog.value = true;
};

const deleteMatchData = () => {
  MatchDataServices.deleteMatchData(matchDataToDelete.value)
    .then(() => {
      getMatchData(5, 1);
    })
    .catch((error) => {
      errorMsg.value = error.response.data.message;
      showError.value = true;
    });
  showConfirmDialog();
};

const updateMatchData = () => {
  const updatedMatchData = {
    matchId: props.matchId,
    metricId: selectedMatchData.value.metricId,
    value: selectedMatchData.value.value,
  };
  MatchDataServices.updateMatchData(
    selectedMatchData.value.id,
    updatedMatchData,
  )
    .then(() => {
      editDialog.value = false;
      getMatchData(itemsPerPage.value, 1);
    })
    .catch((error) => {
      errorMsg.value = error.message;
      showError.value = true;
      // Handle the error, like showing an error message
    });
};

const reloadTable = () => {
  getMatchData(itemsPerPage.value, 1);
};

getMatchData(5, 1);
</script>

<template>
  <div>
    <DataTable
      :data="matchData"
      :count="count"
      :columns="[
        { key: 'data', label: 'Data' },
        { key: 'metric', label: 'Metric' },
      ]"
      :actions="actions"
      @action-event="handleActionEvent"
      @search="search"
      @reload="reloadTable"
    ></DataTable>
    <ConfirmAction
      :show="showConfirm"
      action="Delete"
      @action="deleteMatchData"
      @cancel="showConfirmDialog"
    />
    <div class="text-center">
      <v-dialog v-model="editDialog" class="w-50">
        <v-card v-if="editDialog">
          <v-toolbar color="primary" title="Edit MatchData">
            <v-btn icon="mdi-arrow-left" @click="toggleEditDialog"></v-btn>
          </v-toolbar>
          <v-card-text>
            <TextField
              v-model="selectedMatchData.value"
              label="MatchData Value"
              :validators="{ required }"
            />
            <div class="text-h5 pa-5">
              <Select
                v-model="selectedMatchData.metricId"
                label="Metric"
                :items="metrics"
                :validators="{ required }"
              />
            </div>
          </v-card-text>
          <div class="text-center">
            <v-btn color="primary" class="ma-4" @click="validateForm"
              >Save</v-btn
            >
            <v-btn class="ma-4" @click="toggleEditDialog">Cancel</v-btn>
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
          <v-btn color="primary" block @click="showError = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
