<script setup>
import moment from "moment";
import { ref, onMounted, computed, nextTick } from "vue";
import FacilityStationServices from "../services/facilityStationServices.js";
import Calendar from "./FacilityScheduleStation.vue";
import ReservationDialog from "./ReservationDialog.vue";
import AddFacilityReservation from "./AddFacilityReservation.vue";

const stations = ref([]);
const dataLoaded = ref(false);
const scrollPane = ref(null);
const showDialog = ref(false);
const showAddReservation = ref(false);
const selectedEvent = ref(-1);

const currentStationsPage = ref(1);
const stationsPageSize = ref(7);

const stationsToView = computed(() => {
  const windowStart = stationsPageSize.value * (currentStationsPage.value - 1);
  return stations.value.slice(
    windowStart,
    windowStart + stationsPageSize.value,
  );
});

const numPages = computed(() => {
  return stations.value.length % stationsPageSize.value;
});

const scrollPaneStyle = computed(() => {
  return `scrollpane ${
    numPages.value > 1 ? "paneWithPagination" : "paneNoPagination"
  }`;
});

const showDatePicker = ref(false);
const selectedDate = ref(moment());
const tempDate = ref(null);

const selectedDateString = computed(() => {
  return selectedDate.value.format("ddd, MMM Do");
});

const selectedDateISOString = computed(() => {
  return selectedDate.value.toISOString();
});

const getStations = () => {
  stations.value = [];
  FacilityStationServices.getAll().then((response) => {
    stations.value = response.data;
    dataLoaded.value = true;
  });
};

const handleShow = (reservationID) => {
  console.log("show dialog", reservationID);
  showDialog.value = !showDialog.value;
  selectedEvent.value = reservationID;
};

const changeDateSelection = () => {
  selectedDate.value = moment(tempDate.value);

  showDatePicker.value = false;
};

onMounted(async () => {
  getStations();
  await nextTick();
  scrollPane.value.$el.scrollTop = 52 * 10; // set scroll position
});
</script>

<template>
  <v-card>
    <v-row class="align-center" no-gutters>
      <v-text-field
        :model-value="selectedDateString"
        class="w-25 ma-2"
        prepend-inner-icon="mdi-calendar"
        hide-details
        readonly
        @click="showDatePicker = !showDatePicker"
      >
      </v-text-field>

      <v-spacer />
      <v-spacer />
      <v-spacer />

      <v-btn
        class="justify-end mr-4"
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddReservation = !showAddReservation"
      >
        Add Reservation
      </v-btn>
    </v-row>

    <v-table>
      <thead>
        <tr>
          <td class="text-left" style="width: 73px"></td>
          <td
            v-for="station in stationsToView"
            :key="station.id"
            class="pl-0"
            style="width: 150px"
          >
            {{ station.name }}
          </td>
        </tr>
      </thead>
    </v-table>
    <v-divider></v-divider>
    <v-row ref="scrollPane" :class="scrollPaneStyle" no-gutters>
      <v-table>
        <tbody>
          <tr v-for="i in 23" :key="i">
            <td class="text-caption w-100 d-flex align-start">
              {{ i < 13 ? i : i - 12 }}{{ i > 11 ? "pm" : "am" }}
            </td>
          </tr>
        </tbody>
      </v-table>
      <div v-for="station in stationsToView" :key="station.id">
        <Calendar
          :station-id="station.id"
          :date="selectedDateISOString"
          @show-event="handleShow"
        />
      </div>
    </v-row>
    <ReservationDialog
      :show-dialog="showDialog"
      :reservation-id="selectedEvent"
      @edit-success="getStations()"
    />
    <AddFacilityReservation
      :show="showAddReservation"
      @add-success="getStations()"
    />
    <v-overlay v-model="showDatePicker" contained>
      <v-container>
        <v-row justify="space-around" no-gutters>
          <v-card class="mx-auto">
            <v-date-picker v-model="tempDate" color="primary"></v-date-picker>
            <v-card-actions>
              <v-row class="justify-end" no-gutters>
                <v-btn @click="changeDateSelection">Save</v-btn>
                <v-btn @click="showDatePicker = !showDatePicker">Cancel</v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-overlay>
    <v-row v-show="numPages > 1" no-gutters>
      <v-pagination
        v-model="currentStationsPage"
        :length="numPages"
        :total-visible="4"
      >
      </v-pagination>
    </v-row>
  </v-card>
</template>

<style scoped>
.scrollpane {
  overflow-y: auto; /* Enable vertical scrolling if content overflows */
  border: 1px solid #ccc; /* Optional: Add a border for visual clarity */
}

.paneWithPagination {
  height: 52vh;
}

.paneNoPagination {
  height: 60vh;
}
</style>
