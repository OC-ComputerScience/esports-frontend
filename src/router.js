import { createRouter, createWebHistory } from "vue-router";

import Login from "./views/LoginPage.vue";

import Dashboard from "./views/DashboardBase.vue";
import EditPlayerInfo from "./views/EditPlayerInfo.vue";
import PlayerInfo from "./views/PlayerInfo.vue";
import ViewAlias from "./views/ViewAlias.vue";
import MaintainUsers from "./views/maintain/users/MaintainUsers.vue";
import MaintainTeams from "./views/maintain/teams/MaintainTeams.vue";
import MaintainMatches from "./views/maintain/match/MaintainMatches.vue";
import MaintainTitles from "./views/maintain/titles/MaintainTitles.vue";
import MaintainTitleMetrics from "./views/maintain/metrics/MaintainTitleMetrics.vue";
import MaintainMatchData from "./views/maintain/matchData/MaintainMatchData.vue";
import MaintainMatchParticipants from "./views/maintain/matchParticipants/MaintainMatchParticipants.vue";
import MaintainPlayerData from "./views/maintain/playerData/MaintainPlayerData.vue";
import SignForms from "./views/SignForms.vue";
import DirectorSignForms from "./views/Admin/directorSignForms.vue";

import RouterStateController from "./utils/routerStateController.js";

const routerState = new RouterStateController();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/",
      alias: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: "/",
      alias: "/playerForm",
      name: "playerForm",
      component: EditPlayerInfo,
    },
    {
      path: "/playerInfo",
      name: "playerInfo",
      component: PlayerInfo,
      props: true,
    },
    {
      path: "/viewAlias",
      name: "viewAlias",
      component: ViewAlias,
      props: true,
    },
    {
      path: "/maintain/users",
      name: "maintainUsers",
      component: MaintainUsers,
      props: true,
    },
    {
      path: "/maintain/teams",
      name: "maintainTeams",
      component: MaintainTeams,
      props: true,
    },
    {
      path: "/maintain/titles",
      name: "maintainTitles",
      component: MaintainTitles,
      props: true,
    },
    {
      path: "/maintain/matches",
      name: "maintainMatches",
      component: MaintainMatches,
      props: true,
    },
    {
      path: "/maintain/titles/:titleId/metrics",
      name: "maintainTitleMetrics",
      component: MaintainTitleMetrics,
      props: (route) => ({ titleId: Number(route.params.titleId) }),
    },
    {
      path: "/matchData/match/:matchId",
      name: "maintainMatchData",
      component: MaintainMatchData,
      props: (route) => ({ matchId: Number(route.params.matchId) }),
    },
    {
      path: "/maintain/matches/:matchId/participants",
      name: "maintainMatchParticipants",
      component: MaintainMatchParticipants,
      props: (route) => ({ matchId: Number(route.params.matchId) }),
    },
    {
      path: "/maintain/matches/:matchId/participants/:participantId",
      name: "maintainPlayerData",
      component: MaintainPlayerData,
      props: (route) => ({
        matchId: Number(route.params.matchId),
        participantId: Number(route.params.participantId),
      }),
    },
    {
      path: "/signForms",
      name: "signForms",
      component: SignForms,
      props: true,
    },
    {
      path: "/signForms/director/form/:formId",
      name: "directorSignForms",
      component: DirectorSignForms,
      props: (route) => ({ formId: Number(route.params.formId) }),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  //const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = await routerState.isAuthenticated();

  if (!isAuthenticated) {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  } else if (isAuthenticated) {
    if (!(await routerState.hasCompletedQuestionnare())) {
      if (to.path !== "/playerForm") {
        next({ path: "/playerForm" });
      } else {
        next();
      }
    } else if (!(await routerState.hasSignedForms())) {
      if (to.path !== "/signForms") {
        next({ path: "/signForms" });
      } else {
        next();
      }
    } else {
      next();
    }
  }
  // else if(await routerState.isAuthenticated() && to.path == "/login") {
  //   next({ path: "/"})
  // }
});

export default router;
