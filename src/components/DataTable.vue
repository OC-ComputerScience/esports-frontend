<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDataTableStore } from "../stores/dataTableStore.js";

const store = useDataTableStore();
const { itemsPerPage, page } = storeToRefs(store);
const filter = ref();
const hasLoaded = ref(false);

const props = defineProps({
  data: {
    type: Array,
    default: null,
  },
  // Define the columns dynamically with keys and labels
  columns: {
    type: Array,
    default: null,
  },
  // Other props...
  count: {
    type: Number,
    default: 0,
  },
  actions: {
    type: Array,
    default: null,
  },
});

const standard_actions = ref([]);
const alternate_actions = ref([]);

const emitValues = ["search"];
props.actions
  .map((action) => action.event)
  .forEach((event) => emitValues.push(event));

const emit = defineEmits(["search", "action-event", "reload"]);

const changeItemsPerPage = () => {
  search();
};

const totalItems = computed(() => {
  return props ? Math.ceil(props.count / itemsPerPage.value) : 0;
});

function search() {
  emit("search", filter.value);
}

function reload() {
  emit("reload");
}

function filterActions() {
  props.actions.forEach((action) => {
    if (action.label.includes("Edit") || action.label.includes("Delete")) {
      standard_actions.value.push(action);
    } else {
      alternate_actions.value.push(action);
    }
  });
}

onMounted(() => {
  filterActions();
  hasLoaded.value = true;
});
</script>

<template>
  <v-card class="pa-6">
    <v-row class="justify-space-between">
      <v-btn
        name="Reload"
        style="max-width: 15%"
        variant="outlined"
        prepend-icon="mdi-refresh"
        @click="reload"
        >Reload</v-btn
      >
      <v-text-field
        v-model="filter"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        style="max-width: 20%"
        name="Search"
        label="Search"
        @change="search"
      />
    </v-row>
    <v-row style="justify-content: center">
      <v-table v-if="data.length !== 0">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" class="text-left">
              {{ column.label }}
            </th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td v-for="column in columns" :key="column.key">
              {{ item[column.key] }}
            </td>
            <td v-if="alternate_actions.length > 1" class="text-center">
              <v-menu class="mx-2">
                <!-- eslint-disable-next-line -->
                <template #activator="{ props }">
                  <v-btn :color="'secondary'" v-bind="props">
                    Other Actions
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(action, index) in alternate_actions"
                    :key="index"
                    :value="index"
                    @click="
                      $emit('action-event', {
                        event: action.event,
                        value: item.id,
                      })
                    "
                  >
                    {{ action.label }}
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                v-for="action in standard_actions"
                :key="action.label"
                class="mx-2"
                :color="
                  action.event.includes('delete') ? 'accent' : 'secondary'
                "
                @click="
                  $emit('action-event', {
                    event: action.event,
                    value: item.id,
                  })
                "
              >
                {{ action.label }}
              </v-btn>
            </td>
            <td v-else class="text-center">
              <v-btn
                v-for="action in props.actions"
                :key="action.label"
                class="mx-2"
                :color="
                  action.event.includes('delete') ? 'accent' : 'secondary'
                "
                @click="
                  $emit('action-event', {
                    event: action.event,
                    value: item.id,
                  })
                "
              >
                {{ action.label }}
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <p v-else>No Results Found</p>
    </v-row>
    <v-row class="justify-end mt-10">
      <v-select
        v-model="itemsPerPage"
        style="max-width: 85px"
        class="mr-4"
        :items="[5, 10, 25, 50]"
        variant="outlined"
        label="Items Per Page"
        @update:model-value="changeItemsPerPage"
      />
      <v-pagination
        v-if="hasLoaded"
        v-model="page"
        class="w-auto mx-2"
        :length="totalItems"
        :total-visible="4"
        @update:model-value="search"
      />
    </v-row>
  </v-card>
</template>
<style scoped></style>
