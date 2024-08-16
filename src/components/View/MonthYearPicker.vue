<script setup>
import { reactive, ref, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// const props = defineProps(["modelValue", "errors"]);
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  errors: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "deleteContact"]);

const date = ref({
  month: "",
  year: "",
});

const rules = reactive({
  month: { required },
  year: { required },
});

const v$ = useVuelidate(rules, date);

const months = [
  { name: "January", number: 0 },
  { name: "February", number: 1 },
  { name: "March", number: 2 },
  { name: "April", number: 3 },
  { name: "May", number: 4 },
  { name: "June", number: 5 },
  { name: "July", number: 6 },
  { name: "August", number: 7 },
  { name: "September", number: 8 },
  { name: "October", number: 9 },
  { name: "November", number: 10 },
  { name: "December", number: 11 },
];

const years = ref([]);

function updateDate() {
  let newDate = new Date(date.value.year, date.value.month);
  newDate.setMonth(newDate.getMonth() + 1); // set
  newDate.setDate(0);
  emit("update:modelValue", newDate.toISOString());
}

onMounted(() => {
  if (props.modelValue) {
    let propsDate = new Date(props.modelValue);
    date.value.month = propsDate.getMonth();
    date.value.year = propsDate.getFullYear();
  }

  let currentYear = new Date().getFullYear();
  for (let i = currentYear; i < currentYear + 5; i++) {
    years.value.push(i);
  }
});
</script>

<template>
  <v-expansion-panels class="w-auto mx-2 mb-4">
    <v-expansion-panel elevation="1" bg-color="grey-lighten-4">
      <v-expansion-panel-title class="">
        <template #default="{ expanded }">
          <v-row no-gutters class="align-center">
            <v-col cols="4" class="d-flex justify-start">
              Expected Graduation Date
            </v-col>
            <v-col
              cols="8"
              :class="
                (props.errors.length > 0 ? 'text-red' : 'text-grey') +
                ' pl-xs-4'
              "
            >
              <v-fade-transition leave-absolute>
                <span v-if="expanded" key="0">
                  Enter your expected Graduation Date
                </span>
                <span v-else key="1">
                  {{
                    date.month !== "" && date.year !== ""
                      ? date.month + 1 + "/" + date.year
                      : props.errors[0]
                  }}
                </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row class="ma-4">
          <v-select
            v-model="date.month"
            name="month"
            label="Month"
            class="pa-2"
            :items="months"
            item-title="name"
            item-value="number"
            :error-messages="v$.month.$errors.map((e) => e.$message)"
            :return-object="false"
            @input="v$.month.$touch"
            @blur="v$.month.$touch"
            @update:model-value="updateDate"
          />
          <v-select
            v-model="date.year"
            name="year"
            label="Year"
            class="pa-2"
            :items="years"
            :error-messages="v$.year.$errors.map((e) => e.$message)"
            @input="v$.year.$touch"
            @blur="v$.year.$touch"
            @update:model-value="updateDate"
          />
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
