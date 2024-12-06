import Utils from "../config/utils";
import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import { computed, ref, watchEffect } from "vue";

import AuthServices from "../services/authServices.js";

const user = Utils.getStore("user");

export const useMenuStore = defineStore("menuState", () => {
  const displayActions = ref(user != null);
  const currentRoute = ref()

  const initials = computed(() => (user ? user.fName[0] + user.lName[0] : ""));
  const name = computed(() => (user ? `${user.fName} ${user.lName}` : ""));
  const email = computed(() => user.email);

  function setupRouteWatcher() {
    const route = useRoute();
    watchEffect(
        async () => {
            const previousRoute = currentRoute.value;
            const user = Utils.getStore("user");

            currentRoute.value = route.fullPath;
     
            if(currentRoute.value == "/login" || previousRoute == "/login") {
                try {

                    const isValidToken = await AuthServices.validateToken(user);

                    if(isValidToken) {
                        console.log("Valid Token");
                        displayActions.value = true
                    }
                    
                } catch {
                    console.log("Invalid Token")
                    displayActions.value = false
                }
            }
        }
      );
  }

  return { displayActions, setupRouteWatcher, initials, name, email };
});
