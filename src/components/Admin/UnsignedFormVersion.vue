<script setup>
const props = defineProps({
  unsignedForms: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["sign-form"]);

function formatDate(date) {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date + " 00:00:00").toLocaleDateString("us-EN", options);
}
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Player Signed</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="form in props.unsignedForms" :key="form.id">
        <td>
          {{ form.user.fName + " " + form.user.lName }}
        </td>
        <td>
          {{ formatDate(form.dateSigned) }}
        </td>
        <td>
          <v-btn color="primary" @click="emit('sign-form', form.id)"
            >Sign
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
