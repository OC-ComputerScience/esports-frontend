<script setup>
import { onMounted, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  index: {
    type: Number,
    default: -1,
  },
});

const emit = defineEmits(["update:modelValue", "deleteContact"]);

const data = ref({});

const rules = reactive({
  fName: { required },
  lName: { required },
  phoneNumber: { required },
  relationship: { required },
});

function emitDelete() {
  emit("deleteContact");
}
const v$ = useVuelidate(rules, props.modelValue); // setup the vuelidate object

onMounted(() => {
  data.value = props.modelValue;
});
</script>

<template>
  <div>
    <v-card-title secondary class="d-flex align-center">
      Emergency Contact #{{ props.index + 1 }}
      <v-container v-if="props.index != 0" class="w-auto justify-right">
        <v-icon @click="emitDelete"> mdi-trash-can </v-icon>
        <v-tooltip bottom activator="parent"> Remove Contact </v-tooltip>
      </v-container>
    </v-card-title>
    <v-text-field
      v-model="data.fName"
      :name="'fNameContact' + props.index"
      label="Contact First Name"
      class="pa-2"
      :error-messages="v$.fName.$errors.map((e) => e.$message)"
      @input="v$.fName.$touch"
      @blur="v$.fName.$touch"
    />

    <v-text-field
      v-model="data.lName"
      :name="'lNameContact' + props.index"
      label="Contact Last Name"
      class="pa-2"
      :error-messages="v$.lName.$errors.map((e) => e.$message)"
      @input="v$.lName.$touch"
      @blur="v$.lName.$touch"
    />

    <v-text-field
      v-model="data.phoneNumber"
      :name="'phoneContact' + props.index"
      label="Contact Phone #"
      class="pa-2"
      :error-messages="v$.phoneNumber.$errors.map((e) => e.$message)"
      @input="v$.phoneNumber.$touch"
      @blur="v$.phoneNumber.$touch"
    />

    <v-text-field
      v-model="data.relationship"
      :name="'relationshipContact' + props.index"
      label="Contact Relationship"
      class="pa-2"
      :error-messages="v$.relationship.$errors.map((e) => e.$message)"
      @input="v$.relationship.$touch"
      @blur="v$.relationship.$touch"
    />
  </div>
</template>
