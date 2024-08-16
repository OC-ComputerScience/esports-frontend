<script setup>
import { ref, onMounted } from "vue";
import TextField from "../FormComponents/TextField.vue";
import { required, email } from "@vuelidate/validators";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "emailRemoved"]);

const isMounted = ref(false);
const emailValue = ref("");

onMounted(() => {
  emailValue.value = props.modelValue;
  isMounted.value = true;
});
</script>

<template>
  <v-row v-if="isMounted" class="align-center">
    <TextField
      v-model="emailValue"
      label="Email"
      :validators="{ required, email }"
      @update:model-value="emit('update:modelValue', emailValue)"
    />
    <v-icon class="pb-5" @click="emit('emailRemoved')"> mdi-close </v-icon>
  </v-row>
</template>
