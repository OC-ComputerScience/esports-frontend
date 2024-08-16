<script setup>
import { ref, onMounted, reactive } from "vue";
import TextField from "../FormComponents/TextField.vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

// const props = defineProps(["alias", "isAdd", "titles"]);
const props = defineProps({
  alias: {
    type: Object,
    default: null,
  },
  isAdd: {
    type: Boolean,
  },
  titles: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits("addAlias");
const isEdit = ref(false);
const hideAdd = ref(false);
const temp_title = ref();
const temp_gamer_tag = ref();
/* This is for the textfield validation*/
const data = ref({
  gamerTag: "",
  title: "",
});

const rules = reactive({
  gamerTag: { required },
  title: { required },
});

const v$ = useVuelidate(rules, data);

// This is called before you submit the form
const validateForm = async () => {
  const valid = await v$.value.$validate();
  console.log(v$.value.$errors);
  if (valid) {
    console.log("valid");
    if (props.isAdd) {
      emit("addAlias", {
        gamerTag: data.value.gamerTag,
        title: data.value.title,
      });
    } else {
      emit(
        "editAlias",
        {
          gamerTag: data.value.gamerTag,
          title: data.value.title,
        },
        props.alias.id,
      );
      isEdit.value = false;
      hideAdd.value = false;
    }
  } else {
    return;
  }
};

function toggle() {
  if (isEdit.value) {
    isEdit.value = false;
    data.value.gamerTag = temp_gamer_tag.value;
    data.value.title = temp_title.value;
  } else {
    isEdit.value = true;
  }
}

onMounted(() => {
  if (!props.isAdd) {
    temp_gamer_tag.value = props.alias.gamerTag;
    temp_title.value = props.titles.filter(
      (title) => title.id == props.alias.titleId,
    )[0];
  }
});
</script>

<template>
  <tr v-if="!isAdd" :key="props.alias.id">
    <td v-if="!isEdit">
      {{
        // This takes the title id that the alias has and finds the corresponding name attribute
        //  in the title table
        props.titles.filter((title) => title.id == props.alias.titleId)[0]
      }}
    </td>
    <td v-else>
      <v-select
        v-model="data.title"
        name="Game Title"
        label="Game Title"
        class="pa-2"
        :items="props.titles"
        item-title="name"
        item-value="id"
        :error-messages="v$.title.$errors.map((e) => e.$message)"
        @input="v$.title.$touch"
        @blur="v$.title.$touch"
      />
    </td>
    <td v-if="!isEdit">
      {{ props.alias.gamerTag }}
    </td>
    <td v-else>
      <TextField
        v-model="data.gamerTag"
        label="Gamer Tag"
        :validators="{ required }"
      />
    </td>
    <td>
      <v-icon v-if="!isEdit" small class="mx-4" @click="toggle">
        mdi-pencil
      </v-icon>
      <v-icon v-else small class="mx-4" @click="toggle">
        mdi-minus-circle
      </v-icon>
      <v-icon
        v-if="!isEdit"
        small
        class="mx-4"
        @click="$emit('deleteAlias', props.alias.id)"
      >
        mdi-trash-can
      </v-icon>
      <v-icon v-else small class="mx-4" @click="validateForm">
        mdi-checkbox-marked-circle
      </v-icon>
    </td>
  </tr>

  <tr v-if="isAdd">
    <td v-if="!hideAdd">
      <v-select
        v-model="data.title"
        name="Game Title"
        label="Game Title"
        class="pa-2"
        :items="props.titles"
        item-title="name"
        item-value="id"
        :error-messages="v$.title.$errors.map((e) => e.$message)"
        @input="v$.title.$touch"
        @blur="v$.title.$touch"
      />
    </td>
    <td v-if="!hideAdd">
      <TextField
        v-model="data.gamerTag"
        label="Gamer Tag"
        :validators="{ required }"
      />
    </td>
    <td v-if="!hideAdd">
      <v-btn icon="mdi-minus-circle" @click="hideAdd = true" />
      <v-btn icon="mdi-plus" @click="validateForm" />
    </td>
    <td v-else>
      <v-btn icon="mdi-plus" @click="hideAdd = false" />
    </td>
  </tr>
</template>
