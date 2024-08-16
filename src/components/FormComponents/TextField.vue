<script setup>
import { reactive, ref, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
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
  data.value[props.label] = props.modelValue;
  rules[props.label] = props.validators;

  isMounted.value = true;
  v$ = useVuelidate(rules, data);
});

/* { fieldValue: value, error: value } */
</script>

<template>
  <v-text-field
    v-if="isMounted"
    v-model="data[props.label]"
    class="pa-2"
    :name="props.label"
    :label="props.label"
    :error-messages="v$[props.label].$errors.map((e) => e.$message)"
    @input="v$[props.label].$touch"
    @blur="v$[props.label].$touch"
    @update:model-value="emit('update:modelValue', data[props.label])"
  />
</template>
