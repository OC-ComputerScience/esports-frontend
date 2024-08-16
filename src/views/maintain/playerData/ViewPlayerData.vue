<script setup>
import PlayerDataServices from "../../../services/playerDataServices.js";
import MetricServices from "../../../services/metricServices.js";

import { ref, onMounted } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";
import { useDataTableStore } from "../../../stores/dataTableStore.js";

import DataTable from "../../../components/DataTable.vue";
import ConfirmAction from "../../../components/ConfirmAction.vue";
import TextField from "../../../components/FormComponents/TextField.vue";
import Select from "../../../components/FormComponents/SelectBox.vue";
import { storeToRefs } from "pinia";

const props = defineProps({
  matchId: {
    type: Number,
    default: -1,
  },
  titleId: {
    type: Number,
    default: -1,
  },
  participantId: {
    type: Number,
    default: -1,
  },
});

const store = useDataTableStore();
const { itemsPerPage, page } = storeToRefs(store);

const validator = new FormValidator();

const validateForm = async () => {
  if (await validator.isFormValid()) {
    updateData();
  } else {
    return;
  }
};

const matches = ref([]);
const count = ref(5);
const dialog = ref(false);
const showConfirm = ref(false);
const selectedData = ref({});
const dataToDelete = ref(null);
const errorMsg = ref("");
const showError = ref(false);

const metrics = ref([]);

const actions = [
  { label: "Edit", event: "edit-data" },
  { label: "Delete", event: "delete-data" },
];

const handleActionEvent = (payload) => {
  if (payload.event == "edit-data") viewData(payload.value);

  if (payload.event == "delete-data") {
    dataToDelete.value = payload.value;
    showConfirmDialog();
  }
};

const showConfirmDialog = () => {
  showConfirm.value = !showConfirm.value;
};

const getData = () => {
  PlayerDataServices.getAllForParticipant(
    props.participantId,
    page.value,
    itemsPerPage.value,
  )
    .then((response) => {
      matches.value = response.data.rows;
      count.value = response.data.count;
    })
    .catch((err) => {
      // Create UI to add visual error checking
      errorMsg.value = err.message;
      showError.value = true;
    });
};

async function getDataForId(dataId) {
  await PlayerDataServices.getPlayerDataById(dataId)
    .then((response) => {
      console.log(response);
      selectedData.value = response.data;
    })
    .catch((err) => {
      errorMsg.value = err.message;
      showError.value = true;
    });
}

const search = (filter) => {
  if (filter == "" || filter == null) {
    getData(itemsPerPage.value, page.value);
  } else {
    PlayerDataServices.searchParticipantData(
      props.participantId,
      page.value,
      itemsPerPage.value,
      filter,
    )
      .then((response) => {
        matches.value = response.data.rows;
        count.value = response.data.count;
      })
      .catch((err) => {
        errorMsg.value = err.message;
        showError.value = true;
      });
  }
};

const viewData = async (dataId) => {
  await getDataForId(dataId);
  dialog.value = true;
};

const deleteData = () => {
  PlayerDataServices.deletePlayerData(dataToDelete.value)
    .then(() => {
      getData(5, 1);
    })
    .catch((error) => {
      console.log(error);
      errorMsg.value = error.response.data.message;
      showError.value = true;
    });
  showConfirmDialog();
};

const updateData = () => {
  const updatedMatch = {
    value: selectedData.value.value,
    participantId: props.participantId,
    metricId: selectedData.value.metricId,
  };
  PlayerDataServices.updatePlayerData(selectedData.value.id, updatedMatch)
    .then(() => {
      dialog.value = false;
      getData(itemsPerPage, 1);
    })
    .catch((error) => {
      errorMsg.value = error.message;
      showError.value = true;
      // Handle the error, like showing an error message
    });
};

const getMetrics = () => {
  MetricServices.getAllPlayerMetricsForTitle(props.titleId)
    .then((response) => {
      metrics.value = response.data.map((metric) => {
        return { name: metric.name, value: metric.id };
      });
    })
    .catch((err) => {
      errorMsg.value = err.response.data.message;
      showError.value = true;
    });
};

//watch(props.titleId, getMetrics())

const reloadTable = (itemsPerPage) => {
  getData(itemsPerPage, 1);
};

onMounted(() => {
  getData(5, 1);
  getMetrics();
});
</script>

<template>
  <div>
    <DataTable
      :data="matches"
      :count="count"
      :columns="[
        { key: 'metricName', label: 'Metric' },
        { key: 'value', label: 'Value' },
      ]"
      :actions="actions"
      @action-event="handleActionEvent"
      @search="search"
      @reload="reloadTable"
    ></DataTable>
    <ConfirmAction
      :show="showConfirm"
      action="Delete"
      @action="deleteData"
      @cancel="showConfirmDialog"
    />
    <div class="text-center">
      <v-dialog v-model="dialog" class="w-50">
        <v-card v-if="dialog">
          <v-toolbar color="primary" title="Edit Match">
            <v-btn icon="mdi-arrow-left" @click="dialog = false"></v-btn>
          </v-toolbar>
          <v-card-text>
            <Select
              v-model="selectedData.metricId"
              label="Metric"
              :items="metrics"
              :validators="{ required }"
            />
            <TextField
              v-model="selectedData.value"
              label="Value"
              :validators="{ required }"
            />
          </v-card-text>
          <div class="text-center">
            <v-btn color="primary" class="ma-4" @click="validateForm"
              >Save</v-btn
            >
            <v-btn class="ma-4" @click="dialog = false">Cancel</v-btn>
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
