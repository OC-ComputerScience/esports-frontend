<script setup>
import { ref, onMounted } from "vue";
import { required } from "@vuelidate/validators";
import FormValidator from "../../../components/FormComponents/support/FormValidator";

import Select from "../../../components/FormComponents/SelectBox.vue";

import MatchParticipantServices from "../../../services/matchParticipantServices.js";
import AliasServices from "../../../services/aliasServices.js";

const props = defineProps({
  matchId: {
    type: Number,
    default: -1,
  },
  teamId: {
    type: Number,
    default: -1,
  },
});

const validator = new FormValidator();
const emit = defineEmits(["cancel"]);

const validateForm = async () => {
  if (await validator.isFormValid()) {
    addParticipant();
  } else {
    return;
  }
};

const addParticipant = () => {
  MatchParticipantServices.addParticipant(participant.value)
    .then((response) => {
      if (response.status == 200) {
        showDialog.value = true;
      } else {
        errorMsg.value = response.data.message;
      }
    })
    .catch((err) => {
      errorMsg.value = err.response.data.message;
      showDialog.value = true;
    });
};

const errorMsg = ref("");
const showDialog = ref(false);
const players = ref([]);
const participant = ref({
  aliasId: null,
  matchId: props.matchId,
});

const getTeamMembers = () => {
  AliasServices.getAllForTeam(props.teamId)
    .then((response) => {
      players.value = response.data.map((player) => {
        return { name: player.gamerTag, value: player.id };
      });
    })
    .catch((err) => {
      errorMsg.value = err.response.data.message;
      showDialog.value = true;
    });
};

const resetAdd = () => {
  showDialog.value = false;
  participant.value.aliasId = null;
};

const cancel = () => {
  emit("cancel");
};

onMounted(() => {
  getTeamMembers();
});
</script>

<template>
  <div>
    <div class="w-75 mx-auto mt-4">
      <Select
        v-model="participant.aliasId"
        :items="players"
        label="Team Members"
        :validators="{ required }"
      />
    </div>
    <div class="text-center">
      <v-btn color="primary" class="ma-4" @click="validateForm">Save</v-btn>
      <v-btn class="ma-4" @click="cancel">Cancel</v-btn>
    </div>
    <v-dialog v-model="showDialog" width="auto">
      <v-card>
        <v-card-text>
          {{ errorMsg ? errorMsg : "Successfully Added Participant!" }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="resetAdd">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
