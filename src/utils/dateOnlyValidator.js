import { helpers } from "@vuelidate/validators";

const dateOnlyCheck = (value) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(value);
};

const dateValidator = helpers.withMessage(
  "Date Must match YYYY-MM-DD",
  dateOnlyCheck,
);

export default dateValidator;
