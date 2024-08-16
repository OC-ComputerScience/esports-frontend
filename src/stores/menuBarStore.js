import Utils from "../config/utils";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const user = Utils.getStore("user");

export const useMenuStore = defineStore("menuState", () => {
  const displayActions = ref(user != null);

  const initials = computed(() => (user ? user.fName[0] + user.lName[0] : ""));
  const name = computed(() => (user ? `${user.fName} ${user.lName}` : ""));
  const email = computed(() => user.email);

  function setDisplayActions(value) {
    displayActions.value = value;
  }

  return { displayActions, setDisplayActions, initials, name, email };
});
