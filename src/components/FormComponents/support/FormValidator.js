import useVuelidate from "@vuelidate/core";

export default class FormValidator {
  constructor() {
    this.v$ = useVuelidate();
  }

  async isFormValid() {
    return await this.v$.value.$validate();
  }
}
