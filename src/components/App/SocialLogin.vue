<script setup>
import { ref, onMounted } from "vue";
import AuthServices from "../../services/authServices";
//import UserServices from "../../services/userServices";
import Utils from "../../config/utils.js";
import { useRouter } from "vue-router";
import { useMenuStore } from "../../stores/menuBarStore";

const store = useMenuStore();

const router = useRouter();
const fName = ref("");
const lName = ref("");
const user = ref({});

const loginWithGoogle = () => {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 400,
  });
};

const handleCredentialResponse = async (response) => {
  let token = {
    credential: response.credential,
  };
  await AuthServices.loginUser(token)
    .then((response) => {
      user.value = response.data;
      Utils.setStore("user", user.value);
      fName.value = user.value.fName;
      lName.value = user.value.lName;

      store.setDisplayActions(true);
      //navigateToNextPage();
      router.push({ name: "Dashboard" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// const navigateToNextPage = () => {
//   UserServices.getUser(Utils.getStore("user").userId).then((response) => {
//     if (!response.data.accountUpToDate) {
//       router.push({ name: "playerForm" });
//     } else {
//       router.push({ name: "Dashboard" });
//     }
//   });
// };

onMounted(() => {
  loginWithGoogle();
});
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div id="parent_id" display="flex" />
    </v-row>
  </div>
</template>
