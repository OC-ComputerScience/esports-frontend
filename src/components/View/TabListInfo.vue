<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: null,
  },
  tabLabel: {
    type: String,
    default: "",
  },
  infoLabels: {
    type: Array,
    default: null,
  },
  template: {
    type: Object,
    default: null,
  },
});

const infoItems = ref([]);
const currentTab = ref(1);

const mapItemToTemplate = (item) => {
  let templateKeys = Object.keys(props.template);
  let mappedObject = {};
  Object.keys(item).forEach((key) => {
    if (templateKeys.includes(key)) {
      mappedObject[key] = item[key];
    }
  });
  console.log(mappedObject);
  return mappedObject;
};

onMounted(() => {
  props.items.forEach((item) => {
    infoItems.value.push(mapItemToTemplate(item));
  });
  console.log(infoItems.value);
});
</script>

<template>
  <div>
    <v-tabs v-model="currentTab" color="primary" dark slider-color="primary">
      <div v-if="props.items.length > 1">
        <v-tab
          v-for="item in props.items"
          :key="props.items.indexOf(item)"
          :value="props.items.indexOf(item) + 1"
        >
          {{ `${tabLabel} #${props.items.indexOf(item) + 1}` }}
        </v-tab>
      </div>
      <v-tab v-else :value="1">
        {{ `Primary ${props.tabLabel}` }}
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-card-text>
      <v-window v-model="currentTab">
        <v-window-item
          v-for="item in infoItems"
          :key="infoItems.indexOf(item)"
          :value="infoItems.indexOf(item) + 1"
        >
          <v-list>
            <v-list-item
              v-for="value in item"
              :key="value"
              :title="props.infoLabels[Object.values(item).indexOf(value)]"
              :subtitle="value"
            />
          </v-list>
        </v-window-item>
      </v-window>
    </v-card-text>
  </div>
</template>
