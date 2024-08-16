<script setup>
import { ref, computed } from "vue";
import moment from "moment";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:model-value"]);

const label = ref(props.label);

const showDatePicker = ref(false);
const eventDate = ref(props.modelValue || null);
const tempDate = ref(null);

const eventDateString = computed(() => {
  return eventDate.value?.format("ddd, MMM Do YYYY");
});

const handleSaveDate = () => {
  eventDate.value = moment(tempDate.value);
  showDatePicker.value = false;

  emit("update:model-value", eventDate.value);
};
</script>

<template>
  <v-menu v-model="showDatePicker" :close-on-content-click="false">
    <!-- eslint-disable-next-line -->
    <template #activator="{ props }">
      <v-text-field
        :label="label"
        :model-value="eventDateString"
        prepend-inner-icon="mdi-calendar"
        class="ma-2"
        v-bind="props"
        readonly
        :rules="[() => !!eventDate || 'This value is required!']"
      >
      </v-text-field>
    </template>
    <v-row no-gutters>
      <v-card>
        <v-date-picker v-model="tempDate" color="primary"></v-date-picker>
        <v-card-actions class="justify-end">
          <v-btn @click="handleSaveDate()"> Save </v-btn>
          <v-btn @click="showDatePicker = false"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>
  </v-menu>
</template>
