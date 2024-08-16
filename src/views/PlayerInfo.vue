<script setup>
import { ref, onMounted } from "vue";
import Utils from "../config/utils";

import TabListInfo from "../components/View/TabListInfo.vue";
import InfoRow from "../components/View/InfoRow.vue";

/* API Services */
import TitleServices from "../services/titleServices";
import UserServices from "../services/userServices";
import AliasServices from "../services/aliasServices";

const userInfoLoaded = ref(false);
const userInfo = ref({});

const titles = ref([]);
const emergencyContacts = ref([]);
const aliases = ref([]);

function getUser() {
  let userId = Utils.getStore("user").userId;
  UserServices.getUser(userId).then((response) => {
    userInfo.value = { ...response.data }; // Assign the values from the database to userInfo
    //getDataLists(); // get the list of titles and classifications
    userInfo.value.expectedGradDate = new Date(userInfo.value.expectedGradDate);

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
      for (let i = 0; i < response.data.length; i++) {
        emergencyContacts.value.push(response.data[i]);
      }
    },
  );
}

function getAliases() {
  AliasServices.getAllForUser(Utils.getStore("user").userId).then(
    (response) => {
      for (let i = 0; i < response.data.length; i++) {
        let currentAlias = response.data[i];
        titles.value.forEach((title) => {
          if ((title.id = currentAlias.titleId)) {
            currentAlias.title = title.name;
          }
        });

        aliases.value.push(response.data[i]);
      }
    },
  );
}

async function getTitles() {
  await TitleServices.getTitles().then((response) => {
    console.log(response);
    titles.value = response.data.rows.map((title) => {
      return { name: title.name, value: title.id };
    });
  });
}

onMounted(async () => {
  await getTitles();
  getUser();
  getAliases();
  getEmergencyContacts();
});
</script>

<script>
export default {
  computed: {
    cols() {
      const { xs, sm } = this.$vuetify.display;
      return xs ? [12, 12] : sm ? [5, 9] : [5, 7];
    },
    tabCols() {
      const { xs, sm } = this.$vuetify.display;
      return xs ? 12 : sm ? 12 : 6;
    },
  },
};
</script>

<template>
  <v-container>
    <v-col v-if="userInfoLoaded" class="mx-auto pa-0">
      <v-row class="justify-center align-center">
        <v-col class="text-center" :cols="cols[0]">
          <v-card class="pa-5 elevation-3 border-bottom">
            <v-avatar color="secondary" size="100">
              <span class="accent--text font-weight-bold text-h4">{{
                userInfo.fName[0] + userInfo.lName[0]
              }}</span>
            </v-avatar>

            <v-card-title class="text-h4 text-wrap">
              {{ `${userInfo.fName} ${userInfo.lName}` }}
            </v-card-title>
            <v-card-title class="text-h8 font-weight-light">
              Athlete
            </v-card-title>
          </v-card>
        </v-col>
        <v-col :cols="cols[1]">
          <v-card class="elevation-3">
            <v-table density="comfortable" theme="tableTheme">
              <tbody>
                <InfoRow
                  label="Phone: "
                  :data="userInfo.phoneNumber"
                  icon-name="mdi-phone-outline"
                />
                <InfoRow
                  label="Email: "
                  :data="userInfo.email"
                  icon-name="mdi-email-outline"
                />
                <InfoRow
                  label="Hometown: "
                  :data="`${userInfo.city}, ${userInfo.state} (${userInfo.country})`"
                  icon-name="mdi-home-outline"
                />
                <InfoRow
                  label="Merch Info: "
                  :data="`Shirt: ${userInfo.shirtSize} / Pants: ${userInfo.pantSize}`"
                  icon-name="mdi-tshirt-crew-outline"
                />
                <InfoRow
                  label="Graduation Date: "
                  :data="`${
                    userInfo.expectedGradDate.getMonth() + 1
                  } / ${userInfo.expectedGradDate.getFullYear()}`"
                  icon-name="mdi-school-outline"
                />
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col :cols="tabCols">
          <v-card class="h-100 elevation-3 border-left">
            <TabListInfo
              :items="aliases"
              tab-label="Alias"
              :info-labels="['Gamertag', 'Title']"
              :template="{ title: '', gamerTag: '' }"
            />
          </v-card>
        </v-col>
        <v-col :cols="tabCols">
          <v-card class="h-100 elevation-3 border-left">
            <TabListInfo
              :items="emergencyContacts"
              tab-label="Emergency Contact"
              :info-labels="[
                'First Name',
                'Last Name',
                'Phone #',
                'Relationship',
              ]"
              :template="{
                fName: '',
                lName: '',
                phoneNumber: '',
                relationship: '',
              }"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<style scoped>
.border-bottom {
  border-bottom: 5px solid #80162b;
}
.border-left {
  border-left: 4px solid #80162b;
}
</style>
