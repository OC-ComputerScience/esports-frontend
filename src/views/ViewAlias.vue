<script setup>
import { ref, onMounted } from "vue";
import AliasServices from "../services/aliasServices.js";
import TitleServices from "../services/titleServices.js";
import AliasComponent from "../components/View/AliasComponent.vue";
import Utils from "../config/utils.js";

const aliases = ref({});
const message = ref("Add, Edit, or Delete Aliases");
const titles = ref({});
const titlesLoaded = ref(false);

const props = defineProps({
  id: {
    required: true,
    type: Number,
  },
});

const retrieveAliases = () => {
  AliasServices.getAllForUser(props.id)
    .then((response) => {
      aliases.value = response.data;
    })
    .catch((err) => {
      message.value = err.response.data.message;
    });
};

const retrieveTitles = () => {
  TitleServices.getTitles()
    .then((response) => {
      titles.value = response.data;
      titlesLoaded.value = true;
    })
    .catch((err) => {
      console.log(err);
    });
};

function createAlias(data) {
  AliasServices.create(data, Utils.getStore("user").userId)
    .then(() => {
      retrieveAliases();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function deleteAlias(aliasId) {
  AliasServices.deleteOne(Utils.getStore("user").userId, aliasId)
    .then(() => {
      retrieveAliases();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function editAlias(data, aliasId) {
  AliasServices.update(data, Utils.getStore("user").userId, aliasId)
    .then(() => {
      retrieveAliases();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

onMounted(() => {
  retrieveAliases();
  retrieveTitles();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>Alias View</v-toolbar-title>
      </v-toolbar>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Title</th>
            <th class="text-left">GamerTag</th>
            <th class="text-left">Action</th>
          </tr>
        </thead>
        <tbody v-if="titlesLoaded">
          <AliasComponent
            v-for="alias in aliases"
            :id="alias.id"
            :key="alias.id"
            :alias="alias"
            :is-add="false"
            :titles="titles"
            @edit-alias="editAlias"
            @delete-alias="deleteAlias"
          />

          <AliasComponent
            id="NewAlias"
            :alias="null"
            :is-add="true"
            :titles="titles"
            @add-alias="createAlias"
          />
        </tbody>
      </v-table>
    </v-container>
  </div>
</template>
