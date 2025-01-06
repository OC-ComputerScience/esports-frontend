<script setup>
import { ref } from "vue";
import SocialLogin from "../components/App/SocialLogin.vue";

const notAuthorized = ref(false);

const showUnauthorizedDialog = () => {
  notAuthorized.value = !notAuthorized.value;
};
</script>

<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>Welcome to the Player Portal!</v-toolbar-title>
    </v-toolbar>
    <br /><br />
    <SocialLogin @unauthorized-user="showUnauthorizedDialog" />
    <br /><br />
    <v-dialog v-model="notAuthorized" persistent>
      <v-card class="w-auto mx-auto">
        <v-card-title class="w-auto mx-auto mt-4 text-wrap text-center">
          You must be an authorized user to access the player portal!
        </v-card-title>
        <v-card-text class="w-auto mx-auto mb-4 text-wrap text-center">
          If you would expect to have access and do not, please contact the
          director.
        </v-card-text>

        <v-btn
          color="accent"
          class="w-auto mb-4 mx-auto float-right"
          @click="showUnauthorizedDialog"
        >
          Okay
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>
