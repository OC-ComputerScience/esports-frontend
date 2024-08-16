<script setup>
import UserServices from "../../../services/userServices.js";
import { ref, onMounted } from "vue";
import DataTable from "../../../components/DataTable.vue";
import { useDataTableStore } from "../../../stores/dataTableStore.js";
import { storeToRefs } from "pinia";

const store = useDataTableStore();
const { itemsPerPage, page } = storeToRefs(store);

const users = ref([]);
const count = ref();
const dialog = ref(false);
const user = ref({});
const showError = ref(false);
const errorMsg = ref("");

const actions = [{ label: "View", event: "view-user" }];

const handleActionEvent = (payload) => {
  if (payload.event == "view-user") viewUser(payload.value);
};

const getUsers = (itemsPerPage, page) => {
  UserServices.getAll(itemsPerPage, page)
    .then((response) => {
      users.value = response.data.rows;
      count.value = response.data.count;
    })
    .catch((err) => {
      // Create UI to add visual error checking
      errorMsg.value = err.message;
      showError.value = true;
    });
};

function getUserForID(userId) {
  UserServices.getUser(userId)
    .then((response) => {
      user.value = response.data;
    })
    .catch((err) => {
      errorMsg.value = err.message;
      showError.value = true;
    });
}

const search = (filter) => {
  if (filter == "" || filter == null) {
    getUsers(itemsPerPage.value, page.value);
  } else {
    UserServices.search(filter, itemsPerPage.value, page.value)
      .then((response) => {
        users.value = response.data.rows;
        count.value = response.data.count;
      })
      .catch((err) => {
        errorMsg.value = err.message;
        showError.value = true;
      });
  }
};

const reloadTable = () => {
  getUsers(itemsPerPage.value, 1);
};

onMounted(() => {
  getUsers(5, 1);
});

const viewUser = (userId) => {
  getUserForID(userId);
  dialog.value = true;
};
</script>
<template>
  <div>
    <DataTable
      :data="users"
      :count="count"
      :columns="[
        { key: 'fName', label: 'First Name' },
        { key: 'lName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
      ]"
      :actions="actions"
      @action-event="handleActionEvent"
      @view-user="viewUser"
      @search="search"
      @reload="reloadTable"
    ></DataTable>
    <div class="text-center">
      <v-dialog
        v-model="dialog"
        transition="dialog-top-transition"
        width="auto"
      >
        <v-card v-if="dialog">
          <v-toolbar color="primary" title="View More">
            <v-btn icon="mdi-arrow-left" @click="dialog = false" />
          </v-toolbar>
          <v-card-text>
            <div class="text-h5 pa-5">First Name: {{ user.fName }}</div>
            <div class="text-h5 pa-5">Last Name: {{ user.lName }}</div>
            <div class="text-h5 pa-5">Email: {{ user.email || "None" }}</div>
            <div class="text-h5 pa-5">
              Phone Number: {{ user.phoneNumber || "None" }}
            </div>
            <div class="text-h5 pa-5">
              Address: {{ user.address || "None" }}
            </div>
            <div class="text-h5 pa-5">
              Classification: {{ user.classification || "None" }}
            </div>
          </v-card-text>
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
<style scoped></style>
