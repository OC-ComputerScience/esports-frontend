<script setup>
// const props = defineProps(["label", "data", "iconName"]);
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  data: {
    type: String,
    default: "",
  },
  iconName: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <tr>
    <td>
      <v-icon class="pl-2 pr-5"> {{ props.iconName }} </v-icon>{{ props.label }}
    </td>
    <td>{{ props.data }}</td>
  </tr>
</template>
