<script setup>
import { onMounted, ref, watch } from "vue";
import DateTextField from "../components/FormComponents/DateTextField.vue";
import FacilityReservationServices from "../services/facilityReservationServices";
import FacilityStationServices from "../services/facilityStationServices";
import ReservationRecurrenceServices from "../services/reservationRecurrenceServices";
import TeamServices from "../services/teamServices";
import dateTimeFormat from "../utils/dateTimeFormat";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["add-success"]);

watch(props, () => {
  show.value = true;
});

// eslint-disable-next-line
const show = ref(false);

const eventDate = ref(null);
const eventRecurrEnd = ref(null);
const eventRecurrInterval = ref(null);

const teams = ref([]);
const selectedTeam = ref(null);

const stations = ref([]);
const selectedStation = ref(null);

const selectedReservationType = ref(null);

const eventStartTime = ref("");
const eventEndTime = ref("");

const isRecurringEvent = ref(false);

const form = ref(null);

const errorMsg = ref("");

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
const addReservation = async () => {
  const formState = await form.value.validate();
  if (formState.valid) {
    const dateString = eventDate.value.format("YYYY-MM-DD");

    const startTime =
      dateString + dateTimeFormat.formatTimeToISO(eventStartTime.value);
    const endTime =
      dateString + dateTimeFormat.formatTimeToISO(eventEndTime.value);

    const data = {
      teamId: selectedTeam.value.id,
      facilityStationId: selectedStation.value.id,
      reservationType: selectedReservationType.value,
      startTime,
      endTime,
      isOneTime: !isRecurringEvent.value,
    };

    if (!data.isOneTime) {
      (data.interval = eventRecurrInterval.value),
        (data.startDate = eventDate.value.format("YYYY-MM-DD"));
      data.endDate = eventRecurrEnd.value.format("YYYY-MM-DD");
    }

    FacilityReservationServices.create(data)
      .then((response) => {
        if (isRecurringEvent.value) {
          addReservationRecurrence(response.data.id);
        } else {
          emit("add-success");
          cancel();
        }
      })
      .catch((error) => {
        console.log(error);
        errorMsg.value =
          error.response.data.message ||
          "There was an issue adding the reservation";
      });
  } else {
    console.log("not valid");
  }
};

const addReservationRecurrence = (reservationId) => {
  // const eventRecurrEnd = ref("")
  // const eventRecurrInterval = ref(null)

  const recurrenceData = {
    interval: eventRecurrInterval.value,
    startDate: eventDate.value.format("YYYY-MM-DD"),
    endDate: eventRecurrEnd.value.format("YYYY-MM-DD"),
    facilityReservationId: reservationId,
  };
  ReservationRecurrenceServices.create(recurrenceData)
    .then(() => {
      emit("add-success");
      cancel();
    })
    .catch((error) => {
      errorMsg.value =
        error.response.data.message ||
        "There was an issue adding the recurrence rule";
      console.log(error);
    });
};

const cancel = () => {
  selectedTeam.value = null;
  selectedStation.value = null;
  selectedReservationType.value = null;
  eventEndTime.value = "";
  eventStartTime.value = "";
  isRecurringEvent.value = false;
  show.value = false;
};

onMounted(() => {
  getTeams();
  getStations();
});
</script>

<template>
  <v-dialog v-model="show" persistent>
    <v-col cols="6" class="mx-auto">
      <v-card>
        <v-card-title> Add Facility Reservation </v-card-title>
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
          <v-btn color="primary" class="mx-2 my-4" @click="addReservation()">
            Save
          </v-btn>

          <v-btn color="secondary" class="mx-2 my-4 ml-2" @click="cancel()">
            Cancel
          </v-btn>
        </v-row>
      </v-card>
    </v-col>
  </v-dialog>
</template>

<style scoped>
.scrollpane {
  height: 65vh;
  overflow-y: auto; /* Enable vertical scrolling if content overflows */
  border: 1px solid #ccc; /* Optional: Add a border for visual clarity */
}
</style>
