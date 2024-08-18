<script setup>
import UserServices from "../../../services/userServices.js";
import RoleServices from "../../../services/roleServices.js";
import UserRoleServices from "../../../services/userRoleServices.js";

import { ref, onMounted } from "vue";
import DataTable from "../../../components/DataTable.vue";
import { useDataTableStore } from "../../../stores/dataTableStore.js";
import { storeToRefs } from "pinia";

import Utils from "../../../config/utils.js";

const store = useDataTableStore();
const { itemsPerPage, page } = storeToRefs(store);

const users = ref([]);
const roles = ref([]);
const userRoles = ref([]);

const count = ref();
const dialog = ref(false);
const user = ref({});
const showError = ref(false);
const errorMsg = ref("");

const actions = [{ label: "View", event: "view-user" }];

const handleActionEvent = (payload) => {
  if (payload.event == "view-user") viewUser(payload.value);
};

const getRoles = () => {
  RoleServices.getAllRoles().then((response) => {
    console.log(response);
    roles.value = response.data;
  });
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

  UserRoleServices.getAllRolesForUser(userId).then((response) => {
    user.value.roles = response.data.map((userRole) => {
      return {
        type: userRole.role.type,
        id: userRole.roleId,
      };
    });
    userRoles.value = response.data;
  });
}

const updateRoles = () => {
  const sessionUser = Utils.getStore("user");

  user.value.roles.forEach((userRole) => {
    let addRole = true;

    userRoles.value.forEach((role) => {
      if (userRole.type == role.role.type) {
        addRole = false;
      }
    });

    if (addRole) {
      UserRoleServices.createRole({
        userId: user.value.id,
        roleId: userRole.id,
      });
    }
  });

  userRoles.value.forEach((userRole) => {
    let removeRole = true;

    user.value.roles.forEach((role) => {
      if (userRole.role.type == role.type) {
        removeRole = false;
      }
    });

    if (removeRole) {
      if (userRole.userId == sessionUser.userId) {
        if (userRole.role.type != "Admin") {
          UserRoleServices.deleteRole(userRole.id);
        }
      } else {
        UserRoleServices.deleteRole(userRole.id);
      }
    }
  });
  dialog.value = false;
};

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
  getRoles();
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
            <v-select
              v-model="user.roles"
              label="Roles"
              :items="roles"
              item-title="type"
              item-value="id"
              multiple
              return-object
            />
          </v-card-text>
          <v-row class="w-100" justify="end" no-gutters>
            <v-btn class="mb-4 mr-4" color="primary" @click="updateRoles">
              Save
            </v-btn>
            <v-btn class="mb-4 mr-2" color="secondary" @click="dialog = false">
              Cancel
            </v-btn>
          </v-row>
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
