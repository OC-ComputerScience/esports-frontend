<script setup>
import { reactive, ref, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  question: {
    type: String,
    default: "",
  },
  valueKey: {
    type: String,
    default: null,
  },
  validators: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isMounted = ref(false);

const data = ref({});
const rules = reactive({});

let v$;

onMounted(() => {
  data.value[props.valueKey] = props.modelValue;
  rules[props.valueKey] = props.validators;

  isMounted.value = true;
  v$ = useVuelidate(rules, data);
});
</script>

<template>
  <v-radio-group
    v-if="isMounted"
    v-model="data[props.valueKey]"
    class="pa-2"
    color="text primary"
    :error-messages="v$[props.valueKey].$errors.map((e) => e.$message)"
    @input="v$[props.valueKey].$touch"
    @blur="v$[props.valueKey].$touch"
    @update:model-value="emit('update:modelValue', data[props.valueKey])"
  >
    <p>{{ props.question }}</p>
    <v-radio label="Yes" :value="true" />
    <v-radio label="No" :value="false" />
  </v-radio-group>
</template>
