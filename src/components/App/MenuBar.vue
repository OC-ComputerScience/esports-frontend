<script setup>
//import { useStore } from "vuex";

import ocLogo from "/nav_main.svg";
import background from "/NavBarBackground.png";
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";

import Utils from "../../config/utils";
import AuthServices from "../../services/authServices";
import UserRoleServices from "../../services/userRoleServices";

import { storeToRefs } from "pinia";
import { useMenuStore } from "../../stores/menuBarStore";

const store = useMenuStore();
const { displayActions } = storeToRefs(store);

const router = useRouter();
const user = ref(null);
const userRoles = ref([]);

const title = ref("Esports Portal");
const initials = ref("");
const name = ref("");
const logoURL = ref("");
const backgroundUrl = ref("");

const maintainenceActions = [
  {
    title: "Titles",
    component: "maintainTitles",
  },
  {
    title: "Teams",
    component: "maintainTeams",
  },
  {
    title: "Users",
    component: "maintainUsers",
  },
  {
    title: "Matches",
    component: "maintainMatches",
  },
  {
    title: "Forms",
    component: "maintainForms",
  },
];

const userDetailsLoaded = ref(false);

const resetMenu = async () => {
  user.value = null;
  user.value = Utils.getStore("user");
  if (user.value) {
    initials.value = user.value.fName[0] + user.value.lName[0];
    name.value = user.value.fName + " " + user.value.lName;
    userDetailsLoaded.value = true;

    await getUserRoles();
  }
};
watch(displayActions, resetMenu);

const getUserRoles = async () => {
  await UserRoleServices.getAllRolesForUser(user.value.userId).then(
    (response) => {
      const mappedRoles = response.data.map((currentRole) => {
        return currentRole.role.type;
      });
      userRoles.value = mappedRoles;
    },
  );
};

const logout = () => {
  AuthServices.logoutUser(user.value)
    .then(() => {
      Utils.removeItem("user");
      Utils.removeItem("userAuthenticated");
      Utils.removeItem("userHasCompletedQuestionnare");
      Utils.removeItem("userHasSignedForms");

      store.setDisplayActions(false);
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

onMounted(() => {
  logoURL.value = ocLogo;
  backgroundUrl.value = background;

  resetMenu();
});
</script>

<script>
import { ref } from "vue";
const drawer = ref(false);
export default {
  computed: {
    displayDrawer() {
      const { sm, xs } = this.$vuetify.display;
      return sm || xs ? true : false;
    },
    drawerState() {
      const { sm, xs } = this.$vuetify.display;
      if (!sm && !xs) drawer.value = false;
      return !sm && !xs ? false : drawer.value;
    },
    drawerWidth() {
      const { sm, xs } = this.$vuetify.display;
      return sm ? 450 : xs ? 350 : 500;
    },
  },
};
</script>

<template>
  <div>
    <v-app-bar app class="nav-bar" :image="backgroundUrl">
      <router-link :to="{ name: 'Dashboard' }">
        <v-img class="mx-2" :src="logoURL" height="100" width="100" contain />
      </router-link>
      <v-toolbar-title v-if="!displayDrawer" class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer />

      <div v-if="displayActions && !displayDrawer" class="pr-3">
        <!--<v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn>-->
        <v-btn class="mx-2" :to="{ name: 'Dashboard' }" color="secondary">
          Dashboard
        </v-btn>

        <v-btn v-if="userRoles.includes('Admin')" color="secondary">
          Maintain

          <v-menu activator="parent" open-on-hover>
            <v-list>
              <v-list-item
                v-for="(item, index) in maintainenceActions"
                :key="index"
                :value="index"
                @click="router.push({ name: item.component })"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <!-- <v-btn class="mx-2" :to="{ name: 'addAccount' }" color="secondary"
          >Add Account
        </v-btn> -->
        <v-btn class="mx-2" :to="{ name: 'playerInfo' }" color="secondary">
          My Info
        </v-btn>
        <v-menu v-if="!displayDrawer" bottom min-width="200px" rounded offset-y>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon x-large>
              <v-avatar v-if="userDetailsLoaded" color="secondary">
                <span
                  v-if="userDetailsLoaded"
                  class="accent--text font-weight-bold"
                  >{{ initials }}</span
                >
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="secondary" class="mt-2 mb-2">
                  <span class="accent--text font-weight-bold">{{
                    initials
                  }}</span>
                </v-avatar>
                <h3>{{ name }}</h3>
                <p class="text-caption mt-1">
                  {{ user.email }}
                </p>
                <v-divider class="my-3" />
                <v-btn depressed rounded text @click="logout"> Logout </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
      <v-app-bar-nav-icon
        v-if="displayDrawer"
        variant="text"
        color="secondary"
        @click.stop="drawer = !drawer"
      />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerState"
      location="right"
      :width="drawerWidth"
      temporary
    >
      <v-list>
        <!--<v-btn class="mx-2" :to="{ name: 'tutorials' }"> List </v-btn>
        <v-btn class="mx-2" :to="{ name: 'add' }"> Add Tutorial </v-btn>-->
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
