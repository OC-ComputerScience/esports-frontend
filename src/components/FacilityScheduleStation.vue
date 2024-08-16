<script setup>
import moment from "moment";
import { ref, onMounted, watch } from "vue";
import CalendarEvent from "./FacilityScheduleReservation.vue";
import FacilityReservationServices from "../services/facilityReservationServices.js";

const props = defineProps({
  show: Boolean,
  stationId: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["show-event"]);

const data = ref([]);

const reservations = ref([]);

watch(props, () => {
  getReservations();
});

const getReservations = () => {
  data.value = [];
  const requestData = {
    facilityStationId: props.stationId,
    requestedDate: props.date,
  };
  FacilityReservationServices.getAllByDate(requestData).then((response) => {
    reservations.value = response.data.events;

    reservations.value.forEach((reservation) => {
      const startTime = moment(reservation.startTime).utcOffset(0);
      reservation.startIndex = startTime.hour() - 1;
    });

    for (let i = 0; i < 23; i++) {
      let item = reservations.value.find((item) => item.startIndex == i);
      data.value.push(item || { id: i * -1 - 1 });
    }
  });
};

const emitShow = (reservationID) => {
  emit("show-event", reservationID);
};

onMounted(() => {
  getReservations();
});
</script>

<template>
  <v-row no-gutters class="px-0">
    <v-table>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td
            v-if="item.id >= 0"
            rowspan="1"
            class="d-flex align-top px-1"
            style="width: 150px"
          >
            <CalendarEvent :data="item" @show-event="emitShow" />
          </td>

          <td v-else style="width: 150px"></td>
        </tr>
      </tbody>
    </v-table>
    <v-divider thickness="2" vertical></v-divider>
  </v-row>
</template>

<style scoped>
.table {
  border-bottom: 1px solid;
}
.eventCard {
  height: fill;
}
</style>
