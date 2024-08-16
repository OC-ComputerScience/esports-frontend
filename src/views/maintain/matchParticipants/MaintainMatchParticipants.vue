<script setup>
import { onMounted, ref } from "vue";

import ViewMatchParticipants from "./ViewMatchParticipants.vue";
import AddMatchParticipant from "./AddMatchParticipant.vue";
import MatchServices from "../../../services/matchServices.js";

const props = defineProps({
  matchId: {
    type: Number,
    default: -1,
  },
});

const currentTab = ref("1");
const matchName = ref("");
const teamId = ref(-1);

const switchCurrentTab = () => {
  if (currentTab.value == "1") {
    currentTab.value = "2";
  } else {
    currentTab.value = "1";
  }
};

const getMatchName = async () => {
  const match = await MatchServices.getMatch(props.matchId);
  matchName.value = match.data.name;
  teamId.value = match.data.teamId;
};
onMounted(() => {
  getMatchName();
});
</script>

<script>
export default {
  computed: {
    cols() {
      const { xs, sm } = this.$vuetify.display;
      return xs ? 12 : sm ? 10 : 8;
    },
  },
};
</script>

<template>
  <v-col v-if="matchName" :cols="cols" class="mx-auto">
    <h1 class="mb-2">{{ matchName }} Participants</h1>
    <v-card>
      <v-tabs v-model="currentTab" color="primary" dark slider-color="primary">
        <v-tab value="1">View Participants</v-tab>
        <v-tab value="2">Add Participant</v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="currentTab">
        <v-window-item value="1">
          <ViewMatchParticipants :match-id="props.matchId" />
        </v-window-item>
        <v-window-item value="2">
          <AddMatchParticipant
            :match-id="props.matchId"
            :team-id="teamId"
            @cancel="switchCurrentTab"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </v-col>
</template>
<style scoped></style>
