<script setup>
import moment from "moment";
import { ref, onMounted, computed, watch } from "vue";
import FacilityReservationServices from "../services/facilityReservationServices.js";
import FacilityStationServices from "../services/facilityStationServices";
import ReservationRecurrenceServices from "../services/reservationRecurrenceServices";
import TeamServices from "../services/teamServices";
import dateTimeFormat from "../utils/dateTimeFormat";
import DateTextField from "../components/FormComponents/DateTextField.vue";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  reservationId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["edit-success"]);

const show = ref(false);
const edit = ref(false);
const loading = ref(true);
const reservationInfo = ref(null);

// --- Edit Variables --- //

const teams = ref([]);
const selectedTeam = ref(null);

const stations = ref([]);
const selectedStation = ref(null);

const selectedReservationType = ref(null);

const eventStartTime = ref("");
const eventEndTime = ref("");

const eventDate = ref("");
const eventRecurrEnd = ref("");
const eventRecurrInterval = ref(null);

const isRecurringEvent = ref(false);

const form = ref(null);

const errorMsg = ref("");

watch(props, async () => {
  if (props.reservationId > 0) {
    await getReservation();
    show.value = true;
  }
});

const getTeams = () => {
  TeamServices.getAllTeams().then((response) => {
    teams.value = response.data.rows;
  });
};

const getStations = () => {
  FacilityStationServices.getAll().then((response) => {
    stations.value = response.data;
  });
};

const getReservation = async () => {
  errorMsg.value = "";
  await FacilityReservationServices.getById(props.reservationId).then(
    (response) => {
      reservationInfo.value = response.data;
      reservationInfo.value.startTime = moment(
        reservationInfo.value.startTime,
      ).utcOffset(0);
      reservationInfo.value.endTime = moment(
        reservationInfo.value.endTime,
      ).utcOffset(0);

      loading.value = false;
    },
  );
};

const backgroundColor = computed(() => {
  return `background-color: ${reservationInfo.value.team.teamColor};`;
});

const startTime = computed(() => {
  return reservationInfo.value.startTime.format("h:mm a");
});
const endTime = computed(() => {
  return reservationInfo.value.endTime.format("h:mm a");
});

const startEdit = async () => {
  eventDate.value = reservationInfo.value.startTime;
  selectedTeam.value = reservationInfo.value.teamId;
  selectedStation.value = reservationInfo.value.facilityStationId;
  selectedReservationType.value = reservationInfo.value.reservationType;
  eventStartTime.value = reservationInfo.value.startTime.format("h:mm a");
  eventEndTime.value = reservationInfo.value.endTime.format("h:mm a");
  isRecurringEvent.value = !reservationInfo.value.isOneTime;

  if (!reservationInfo.value.isOneTime) {
    console.log(reservationInfo.value);
    await ReservationRecurrenceServices.getByReservationId(
      reservationInfo.value.id,
    ).then((response) => {
      eventRecurrEnd.value = moment(response.data.endDate).utcOffset(0);
      eventRecurrInterval.value = response.data.interval;
    });
  }

  edit.value = true;
};

const cancelEdit = () => {
  selectedTeam.value = null;
  selectedStation.value = null;
  selectedReservationType.value = null;
  eventEndTime.value = "";
  eventStartTime.value = "";
  isRecurringEvent.value = false;
  edit.value = false;
};

const saveEdit = async () => {
  const formState = await form.value.validate();
  if (formState.valid) {
    const dateString = eventDate.value.format("YYYY-MM-DD");

    const startTime =
      dateString + dateTimeFormat.formatTimeToISO(eventStartTime.value);
    const endTime =
      dateString + dateTimeFormat.formatTimeToISO(eventEndTime.value);

    try {
      // update event recurrence if the value changed
      if (!reservationInfo.value.isOneTime != isRecurringEvent.value) {
        if (isRecurringEvent.value) {
          const recurrenceData = {
            interval: eventRecurrInterval.value,
            startDate: eventDate.value.format("YYYY-MM-DD"),
            endDate: eventRecurrEnd.value.format("YYYY-MM-DD"),
            facilityReservationId: reservationInfo.value.id,
          };

          ReservationRecurrenceServices.create(recurrenceData);
        } else {
          ReservationRecurrenceServices.getByReservationId(
            reservationInfo.value.id,
          ).then((response) => {
            const recurrenceId = response.data.id;

            ReservationRecurrenceServices.delete(recurrenceId);
          });
        }
      }

      const updatedTeamId =
        reservationInfo.value.teamId != selectedTeam.value
          ? selectedTeam.value.id
          : reservationInfo.value.teamId;
      const updatedStationId =
        reservationInfo.value.facilityStationId != selectedStation.value
          ? selectedStation.value.id
          : reservationInfo.value.facilityStationId;

      const updatedReservationData = {
        teamId: updatedTeamId,
        facilityStationId: updatedStationId,
        reservationType: selectedReservationType.value,
        isOneTime: !isRecurringEvent.value,
        startTime,
        endTime,
      };

      FacilityReservationServices.update(
        reservationInfo.value.id,
        updatedReservationData,
      )
        .then(() => {
          cancelEdit();
          loading.value = true;
          getReservation();
          emit("edit-success");
        })
        .catch((error) => {
          errorMsg.value =
            error.response.data.message ||
            "There was an issue updating the reservation";
        });
    } catch {
      errorMsg.value = "There was an issue updating the recurrence";
    }
  }
};

onMounted(() => {
  show.value = props.showDialog;
  getStations();
  getTeams();
});
</script>

<template>
  <v-dialog v-model="show" contained>
    <v-card class="w-75 mx-auto">
      <div v-if="!loading && !edit">
        <v-card-title :style="backgroundColor" />
        <v-row no-gutters class="align-center justify-space-between">
          <div>
            <v-card-title>
              {{ reservationInfo.team.name }}:
              {{ reservationInfo.reservationType }}
            </v-card-title>
            <v-card-text> {{ startTime }} - {{ endTime }} </v-card-text>
          </div>
          <v-icon class="ma-4" @click="startEdit()"> mdi-pencil </v-icon>
        </v-row>
      </div>
      <div v-else-if="edit">
        <v-card-title> Edit Reservation </v-card-title>
        <div class="scrollpane">
          <v-form ref="form" validate-on="input">
            <DateTextField
              v-model="eventDate"
              label="Event Date"
              :rules="[() => !!eventDate || 'This value is required!']"
            />

            <v-combobox
              v-model="selectedTeam"
              label="Team"
              :items="teams"
              item-title="name"
              item-value="id"
              class="mx-2"
              :rules="[() => !!selectedTeam || 'This value is required!']"
            >
            </v-combobox>

            <v-combobox
              v-model="selectedReservationType"
              label="Reservation Type"
              :items="['Match', 'Practice']"
              item-title="name"
              item-value="id"
              class="mx-2"
              :rules="[
                () => !!selectedReservationType || 'This value is required!',
              ]"
            >
            </v-combobox>

            <v-combobox
              v-model="selectedStation"
              label="Station"
              :items="stations"
              item-title="name"
              item-value="id"
              class="mx-2"
              :rules="[() => !!selectedStation || 'This value is required!']"
            >
            </v-combobox>

            <v-text-field
              v-model="eventStartTime"
              label="Start Time"
              class="mx-2"
              :rules="[
                () => !!eventStartTime || 'This value is required!',
                dateTimeFormat.testTimeFormat(eventStartTime),
                dateTimeFormat.testTimeIncrement(eventStartTime),
              ]"
            >
            </v-text-field>

            <v-text-field
              v-model="eventEndTime"
              label="End Time"
              class="mx-2"
              :rules="[
                () => !!eventEndTime || 'This value is required!',
                dateTimeFormat.testTimeFormat(eventEndTime),
                dateTimeFormat.testTimeIncrement(eventEndTime),
              ]"
            >
            </v-text-field>

            <!-- Recurrence Info // Admin Restricted -->
            <div>
              <v-checkbox v-model="isRecurringEvent" class="ml-4">
                <template #label>
                  <div>Is Recurring Event</div>
                </template>
              </v-checkbox>

              <div v-if="isRecurringEvent">
                <DateTextField
                  v-model="eventRecurrEnd"
                  label="Recurrence End Date"
                />
                <v-text-field
                  v-model="eventRecurrInterval"
                  label="Recurrence Interval"
                  class="mx-2"
                  :rules="[
                    () => !!eventRecurrInterval || 'This value is required!',
                    dateTimeFormat.verifyInterval(eventRecurrInterval),
                  ]"
                >
                </v-text-field>
              </div>
            </div>
          </v-form>
        </div>
        <p v-if="errorMsg != ''" class="text-center">{{ errorMsg }}</p>
        <v-row class="justify-end" no-gutters>
          <v-btn color="primary" class="mx-2 my-4" @click="saveEdit()">
            Save
          </v-btn>

          <v-btn color="secondary" class="mx-2 my-4 ml-2" @click="cancelEdit()">
            Cancel
          </v-btn>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.scrollpane {
  height: 52vh;
  overflow-y: auto; /* Enable vertical scrolling if content overflows */
  border: 1px solid #ccc; /* Optional: Add a border for visual clarity */
}
</style>
