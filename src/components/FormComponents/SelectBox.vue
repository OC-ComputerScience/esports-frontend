<script setup>
import { reactive, ref, onMounted } from "vue";
import useVuelidate from "@vuelidate/core";

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  label: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
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
  data.value[props.label] = props.modelValue;
  rules[props.label] = props.validators;

  isMounted.value = true;
  v$ = useVuelidate(rules, data);
});
</script>

<template>
  <v-select
    v-if="isMounted"
    v-model="data[props.label]"
    class="pa-2"
    :name="props.label"
    :label="props.label"
    :items="props.items"
    item-title="name"
    item-value="value"
    :error-messages="v$[props.label].$errors.map((e) => e.$message)"
    @input="v$[props.label].$touch"
    @blur="v$[props.label].$touch"
    @update:model-value="emit('update:modelValue', data[props.label])"
  />
</template>
