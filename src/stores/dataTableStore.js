import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataTableStore = defineStore("dataTableState", () => {
  const itemsPerPage = ref(5);
  const page = ref(1);

  function setItemsPerPage(value) {
    itemsPerPage.value = value;
  }

  function setPage(value) {
    page.value = value;
  }
  return { itemsPerPage, page, setPage, setItemsPerPage };
});
