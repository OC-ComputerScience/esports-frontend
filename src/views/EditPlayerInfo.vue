<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import Utils from "../config/utils";

/* Form Components  */
import EmergencyContact from "../components/View/EmergencyContact.vue";
import MonthYearPicker from "../components/View/MonthYearPicker.vue";
import TextField from "../components/FormComponents/TextField.vue";
import ComboBox from "../components/FormComponents/ComboBox.vue";
import YesNoRadio from "../components/FormComponents/YesNoRadio.vue";
// import Select from "../components/FormComponents/SelectBox.vue";
/* API Services */
//import TitleServices from "../services/titleServices";
import UserServices from "../services/userServices";
import AliasServices from "../services/aliasServices";

//const titles = ref(); //Store the games (titles) retrieved from the database
const userInfoLoaded = ref(false); // used to prevent the components from loading before data is ready
const errorMessage = ref();
const showDialog = ref(false);

const router = useRouter();

// storage for the basic user info
const userInfo = ref({
  fName: "",
  lName: "",
  email: "",
  phoneNumber: "",
  city: "",
  state: "",
  country: "",
  shirtSize: "",
  pantSize: "",
  outsidePC: "",
  fullVacc: "",
  classification: "",
  expectedGradDate: "",
  agreementSigned: "",
  title: "",
  gamerTag: "",
  role: "",
  accountUpToDate: "",
});

// an array of objects to store emergency contact info
const emergencyContacts = ref([]);

// Object to store validation rules and their respective errors
const rules = reactive({});

const v$ = useVuelidate(rules, userInfo); // setup the vuelidate object

// validate the contents of the form before submitting
const validateForm = async () => {
  const valid = await v$.value.$validate(); // check all fields for invalid input
  if (valid) {
    // if no errors, proceed with form submission
    try {
      errorMessage.value = "";
      userInfo.value.accountUpToDate = true;
      await updateInfo();
      if (errorMessage.value == "") {
        router.push({ name: "Dashboard" });
      }
    } catch (error) {
      errorMessage.value = error.message;
      showDialog.value = true;
    }
  } else {
    return;
  }
};

const sizes = ref(["S", "M", "L", "XL", "XXL", "XXXL"]); // shirt and pant sizes (may migrate to backend)
const classifications = ref(); // Storage for the enumerated types for year classifications

// add an object to the emergency contact array
function addContact(contactInfo) {
  let contact = {
    fName: "",
    lName: "",
    emailAddress: "",
    relationship: "",
  };
  if (contactInfo != null) {
    contact = { ...contactInfo };
  }
  emergencyContacts.value.push(contact);
}

// remove a specific object from the emergency contact array
function removeContact(contact) {
  emergencyContacts.value = emergencyContacts.value.filter(
    (current) => current != contact,
  );
}

// send the form data to the backend to update the user's info
async function updateInfo() {
  let userId = Utils.getStore("user").userId;

  UserServices.updateUser(userId, userInfo.value).catch((error) => {
    console.log(error);
    errorMessage.value = `Error Updating User: ${error.response.data.message}, please contact an admin`;
  });

  for (let i = 0; i < emergencyContacts.value.length; i++) {
    let currentContact = emergencyContacts.value[i];
    if (currentContact.id) {
      UserServices.updateEmergencyContact(userId, currentContact).catch(
        (error) => {
          console.log(error);
          errorMessage.value = `Emergency Contact Error: ${error.response.data.message}, please contact an admin`;
        },
      );
    } else {
      UserServices.addEmergencyContact(userId, currentContact).catch(
        (error) => {
          console.log(error);
          errorMessage.value = `Emergency Contact Error: ${error.response.data.message}, please contact an admin`;
        },
      );
    }
  }

  /* Get the id associated with the primary alias (if any),
        and update it accordingly */
  const response = await AliasServices.getPrimaryAlias(userId);

  if (response.data.length == 0) {
    AliasServices.create(userId, {
      gamerTag: userInfo.value.gamerTag,
    });
  } else {
    await AliasServices.update(userId, response.data[0].id, {
      title: userInfo.value.title,
      gamerTag: userInfo.value.gamerTag,
    });
  }
}

// retrieve the user's current information from the backend
function getUser() {
  let userId = Utils.getStore("user").userId;
  UserServices.getUser(userId).then((response) => {
    userInfo.value = { ...response.data }; // Assign the values from the database to userInfo
    getDataLists(); // get the list of titles and classifications

    AliasServices.getPrimaryAlias(userId).then((response) => {
      if (response.data.length > 0) {
        // check if there is a primary alias
        userInfo.value.gamerTag = response.data[0].gamerTag;
        userInfo.value.title = parseInt(response.data[0].titleId);
      }
      // set to true so the components know that the data need is ready
      userInfoLoaded.value = true;
    });
  });
}

function getEmergencyContacts() {
  UserServices.getEmergencyContacts(Utils.getStore("user").userId).then(
    (response) => {
      if (response.data.length > 0) {
        for (let i = 0; i < response.data.length; i++) {
          addContact(response.data[i]);
        }
      } else {
        addContact();
      }
    },
  );
}

const getDataLists = () => {
  // TitleServices.getAllTitles().then((response) => {
  //   titles.value = response.data.map((title) => {
  //     return { name: title.name, value: title.id };
  //   });
  // });

  // get the list of classifications supported
  UserServices.getClassifications().then((response) => {
    classifications.value = response.data;
  });
};

const getErrorMessage = () => {
  if (v$.value.$errors.length) {
    let length = v$.value.$errors.length;
    return (
      length +
      ` issue${length > 1 ? "s" : ""} need${
        length > 1 ? "" : "s"
      } to be resolved`
    );
  } else return errorMessage;
};

onMounted(() => {
  // initialize user information
  getEmergencyContacts();
  getUser();
  Object.assign(userInfo.value, Utils.getStore("user")); // info from google auth
  // get the list of supported titles from the backend
});
</script>

<script>
export default {
  computed: {
    cols() {
      const { xs, sm } = this.$vuetify.display;
      return xs ? 12 : sm ? 10 : 6;
    },
  },
};
</script>

<template>
  <v-container class="pa-0">
    <v-col :cols="cols" class="mx-auto pa-0">
      <v-card v-if="userInfoLoaded">
        <v-container class="pa-4">
          <v-card-title primary-title>
            {{ "Hello, " + userInfo.fName + "!" }}
          </v-card-title>
          <p class="pa-4">
            Please fill out the following information to complete your account
            setup.
          </p>
          <v-form class="mt-4">
            <ComboBox
              v-model="userInfo.classification"
              :items="classifications"
              label="Classification"
              :validators="{ required }"
            />

            <TextField
              v-model="userInfo.phoneNumber"
              label="Phone #"
              :validators="{ required }"
            />

            <TextField
              v-model="userInfo.city"
              label="City"
              :validators="{ required }"
            />

            <TextField
              v-model="userInfo.state"
              label="State"
              :validators="{ required }"
            />

            <TextField
              v-model="userInfo.country"
              label="Country"
              :validators="{ required }"
            />

            <title>Expected Graduation Date</title>
            <MonthYearPicker
              v-model="userInfo.expectedGradDate"
              :errors="
                v$.$errors
                  .filter(
                    (e) => e.$property == 'month' || e.$property == 'year',
                  )
                  .map((e) => e.$message)
              "
            />

            <TextField
              v-model="userInfo.gamerTag"
              label="Gamertag"
              :validators="{ required }"
            />

            <!--This has to be a v-select because v-combobox doesn't destructure
            Javascript objects -->
            <!--<Select
              v-model="userInfo.title"
              :items="titles"
              label="What game do you play?"
              :validators="{ required }"
            />-->

            <ComboBox
              v-model="userInfo.shirtSize"
              :items="sizes"
              label="Shirt Size"
              :validators="{ required }"
            />

            <ComboBox
              v-model="userInfo.pantSize"
              :items="sizes"
              label="Pant Size"
              :validators="{ required }"
            />

            <YesNoRadio
              v-model="userInfo.outsidePC"
              question="Do you have a PC in your Dorm/Housing that you can compete with?"
              value-key="outsidePC"
              :validators="{ required }"
            />

            <YesNoRadio
              v-model="userInfo.fullVacc"
              question="Are you fully vaccinated? (with booster)"
              value-key="fullVacc"
              :validators="{ required }"
            />

            <EmergencyContact
              v-for="contact in emergencyContacts"
              :key="emergencyContacts.indexOf(contact)"
              :index="emergencyContacts.indexOf(contact)"
              :model-value="contact"
              @delete-contact="removeContact(contact)"
            />
            <v-btn
              color="secondary"
              class="w-50 mx-auto d-block"
              @click="addContact"
            >
              Add contact
            </v-btn>
          </v-form>
        </v-container>
        <v-container class="w-75 mx-auto text-center">
          <p
            v-if="v$.$errors.length > 0 || errorMessage"
            class="text-red text-h7"
          >
            {{ getErrorMessage() }}
          </p>
        </v-container>
        <v-container class="mt-0">
          <v-btn
            color="secondary"
            class="w-100 mx-auto ma-4"
            :disabled="v$.$errors.length > 0 || errorMessage"
            @click="validateForm"
          >
            Save
          </v-btn>
          <v-btn
            v-if="userInfo.accountUpToDate"
            color="accent"
            class="w-100 mx-auto ma-4"
            @click="router.push({ name: 'Dashboard' })"
          >
            Cancel
          </v-btn>
        </v-container>
      </v-card>
    </v-col>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="showDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
